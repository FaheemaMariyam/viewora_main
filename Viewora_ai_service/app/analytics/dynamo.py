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
from collections import defaultdict

# Initialize DynamoDB client
dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv('AWS_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

view_table = dynamodb.Table('PropertyViewEvents')
interest_table = dynamodb.Table('PropertyInterestEvents')


def get_property_analytics(properties: list) -> str:
    """
    Fetches real-time view and interest counts from DynamoDB for the given properties.
    Returns a human-readable summary for the AI to use in its response.
    
    Args:
        properties: List of property metadata dicts containing 'property_id'
    
    Returns:
        str: Analytics summary text
    """
    if not properties:
        return "No specific analytics available for the current query."
    
    # Extract property IDs
    property_ids = [str(prop.get('property_id')) for prop in properties if prop.get('property_id')]
    
    if not property_ids:
        return "Property analytics are being indexed."
    
    # Fetch view counts
    view_counts = defaultdict(int)
    try:
        for prop_id in property_ids:
            response = view_table.query(
                KeyConditionExpression=Key('property_id').eq(prop_id),
                Select='COUNT'
            )
            view_counts[prop_id] = response.get('Count', 0)
    except Exception as e:
        print(f"DynamoDB View Query Error: {e}")
    
    # Fetch interest counts
    interest_counts = defaultdict(int)
    try:
        for prop_id in property_ids:
            response = interest_table.query(
                KeyConditionExpression=Key('property_id').eq(prop_id),
                Select='COUNT'
            )
            interest_counts[prop_id] = response.get('Count', 0)
    except Exception as e:
        print(f"DynamoDB Interest Query Error: {e}")
    
    # Build analytics summary
    analytics_lines = []
    for prop_id in property_ids:
        views = view_counts.get(prop_id, 0)
        interests = interest_counts.get(prop_id, 0)
        
        # Categorize popularity
        if views > 20 or interests > 5:
            popularity = "High demand"
        elif views > 10 or interests > 2:
            popularity = "Moderate interest"
        elif views > 0 or interests > 0:
            popularity = "Growing interest"
        else:
            popularity = "Newly listed"
        
        analytics_lines.append(
            f"Property {prop_id}: {views} views, {interests} expressions of interest ({popularity})"
        )
    
    if not analytics_lines:
        return "Real-time analytics are currently being synchronized."
    
    return "Market Analytics:\n" + "\n".join(analytics_lines)

