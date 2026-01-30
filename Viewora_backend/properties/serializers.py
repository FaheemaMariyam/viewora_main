from rest_framework import serializers

from interests.models import PropertyInterest

from .models import Property, PropertyImage


class PropertyCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Property
        exclude = (
            "seller",
            "status",
            "is_active",
            "view_count",
            "interest_count",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        images = validated_data.pop("images", [])

        property_obj = Property.objects.create(
            **validated_data, status="published", is_active=True
        )

        for img in images:
            PropertyImage.objects.create(property=property_obj, image=img)

        return property_obj


class PropertyListSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField()
    is_interested = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "seller",
            "title",
            "price",
            "city",
            "locality",
            "property_type",
            "area_size",
            "area_unit",
            "bedrooms",
            "bathrooms",
            "view_count",
            "interest_count",
            "created_at",
            "is_interested",
            "is_active",
            "status",
            "cover_image",
        ]

    def get_is_interested(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        return PropertyInterest.objects.filter(
            property=obj, client=request.user
        ).exists()

    def get_cover_image(self, obj):
        image = obj.images.first()
        if image:
            # S3 storage already returns full URL, no need for build_absolute_uri
            return image.image.url
        return None


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["id", "image"]

    def get_image(self, obj):
        # S3 storage already returns full URL, no need for build_absolute_uri
        return obj.image.url


class PropertyDetailSerializer(serializers.ModelSerializer):
    is_interested = serializers.SerializerMethodField()
    active_interest_id = serializers.SerializerMethodField()
    images = PropertyImageSerializer(many=True, read_only=True)
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = "__all__"

    def get_is_interested(self, obj):
        user = self.context["request"].user
        return obj.interests.filter(client=user).exists()

    def get_active_interest_id(self, obj):
        user = self.context["request"].user
        interest = obj.interests.filter(client=user).first()
        return interest.id if interest else None

    def get_video_url(self, obj):
        return obj.video.video_url if hasattr(obj, "video") else None


class SellerPropertyListSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "price",
            "city",
            "locality",
            "status",
            "is_active",
            "cover_image",
            "created_at",
        ]

    def get_cover_image(self, obj):
        image = obj.images.first()
        if not image:
            return None

        # S3 storage already returns full URL, no need for build_absolute_uri
        return image.image.url


class PropertyUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Property
        exclude = ["seller", "created_at", "updated_at"]

    def update(self, instance, validated_data):
        images = validated_data.pop("images", [])

        instance = super().update(instance, validated_data)

        for img in images:
            PropertyImage.objects.create(property=instance, image=img)

        return instance
