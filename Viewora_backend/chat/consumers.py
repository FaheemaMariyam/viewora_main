import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from interests.models import PropertyInterest

from .models import ChatMessage


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.user = self.scope["user"]
            self.interest_id = self.scope["url_route"]["kwargs"]["interest_id"]
            self.room_group_name = f"interest_{self.interest_id}"

            print(f"WS ATTEMPT: User={self.user}, Interest={self.interest_id}")

            if not self.user.is_authenticated:
                print("WS REJECTED: User not authenticated")
                await self.close(code=4001)
                return

            allowed = await self.is_allowed_user()
            if not allowed:
                print(f"WS REJECTED: User {self.user} not allowed for interest {self.interest_id}")
                await self.close(code=4003)
                return

            if self.channel_layer:
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                print(f"WS CONNECTED: {self.user} joined {self.room_group_name}")
                await self.accept()
            else:
                print("WS ERROR: Channel layer missing")
                await self.close(code=4000)

        except Exception as e:
            print(f"WS CRITICAL ERROR: {e}")
            await self.close(code=4000)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print(" WS DISCONNECTED:", self.user)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get("type")

        #  CHAT MESSAGE
        if event_type == "message":
            message = data.get("message")
            if not message:
                return

            msg = await self.save_message(message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "id": msg.id,
                    "sender": self.user.username,
                    "message": msg.message,
                    "time": msg.created_at.isoformat(),
                },
            )

        # READ RECEIPT
        elif event_type == "read":
            message_ids = data.get("message_ids", [])
            if not message_ids:
                return

            await self.mark_messages_read(message_ids)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "read_receipt",
                    "message_ids": message_ids,
                    "reader": self.user.username,
                },
            )

        # WEBRTC SIGNALS
        elif event_type in (
            "call_request",
            "call_accept",
            "call_end",
            "offer",
            "answer",
            "ice",
        ):

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "webrtc_signal",
                    "signal_type": event_type,
                    "data": data.get("data"),
                    "sender": self.user.username,
                },
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def read_receipt(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "read_receipt",
                    "message_ids": event["message_ids"],
                    "reader": event["reader"],
                }
            )
        )

    async def webrtc_signal(self, event):
        #  DO NOT SEND SIGNAL BACK TO SENDER
        if event["sender"] == self.user.username:
            return

        await self.send(
            text_data=json.dumps(
                {
                    "type": event["signal_type"],
                    "data": event["data"],
                    "sender": event["sender"],
                }
            )
        )

    #  HELPERS
    @sync_to_async
    def is_allowed_user(self):
        try:
            interest = PropertyInterest.objects.get(id=self.interest_id)
            return self.user == interest.client or self.user == interest.broker
        except PropertyInterest.DoesNotExist:
            return False

    @sync_to_async
    def save_message(self, message):
        interest = PropertyInterest.objects.get(id=self.interest_id)
        return ChatMessage.objects.create(
            interest=interest, sender=self.user, message=message
        )

    @sync_to_async
    def mark_messages_read(self, message_ids):
        ChatMessage.objects.filter(id__in=message_ids).exclude(sender=self.user).update(
            is_read=True
        )
