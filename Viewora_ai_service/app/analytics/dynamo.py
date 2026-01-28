"""
This file handles the Real-Time Market Data layer.
It is responsible for:
1. Connecting to AWS DynamoDB tables (PropertyViewEvents, PropertyInterestEvents).
2. Fetching view counts and interest metrics for specific properties.
3. Summarizing this data into human-readable text (e.g., "High demand") for the AI to mention.
"""
import os
import boto3   #aws sdk for python to connect aws service on here
from boto3.dynamodb.conditions import Key

def get_property_analytics(properties: list) -> str:
    """
    Fetches analytics (views and interests) from DynamoDB for the given property objects.
    Ensures context uses human-readable names instead of IDs.
    """
    if not properties:
        return "No analytics available for these properties."

    try:
        dynamodb = boto3.resource(
            "dynamodb",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION"),
        )
        view_table = dynamodb.Table("PropertyViewEvents")
        interest_table = dynamodb.Table("PropertyInterestEvents")
        
        analytics_summary = []
        
        for prop in properties:
            pid_str = str(prop.get("property_id"))
            locality = prop.get("locality", "Unknown Location")
            
            #  Fetch Views
            view_response = view_table.query(
                KeyConditionExpression=Key("property_id").eq(pid_str)
            )
            total_views = sum(int(item.get("view_count", 0)) for item in view_response.get("Items", []))
            
            #  Fetch Interests
            interest_response = interest_table.query(
                KeyConditionExpression=Key("property_id").eq(pid_str)
            )
            total_interests = len(interest_response.get("Items", []))
            
            if total_views > 0 or total_interests > 0:
                summary = f"- The {prop.get('type', 'property')} in {locality} ({prop.get('city')}) has {total_views} views and {total_interests} interested buyers."
                analytics_summary.append(summary)
        
        if not analytics_summary:
            return "Minimal market traffic data for these properties currently."
            
        return "\n".join(analytics_summary)

    except Exception as e:
        print(f"Error fetching analytics: {e}")
        return "Analytics service temporarily unavailable."

