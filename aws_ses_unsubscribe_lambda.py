import json
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize SES v2 client
# Boto3 implicitly uses the execution role credentials provided by AWS Lambda
ses_client = boto3.client('sesv2')

def lambda_handler(event, context):
    logger.info(f"Received SNS event: {json.dumps(event)}")
    
    for record in event.get('Records', []):
        try:
            # Parse the SNS message payload
            sns_message_str = record.get('Sns', {}).get('Message')
            if not sns_message_str:
                continue
                
            sns_message = json.loads(sns_message_str)
            
            # Identify the event type.
            # When a user clicks {{amazonSESUnsubscribeUrl}}, SES automatically
            # categorizes it as a 'Subscription' event type.
            event_type = sns_message.get('eventType')
            
            if event_type not in ['Subscription', 'Unsubscribe']:
                logger.info(f"Ignoring non-subscription event type: {event_type}")
                continue
                
            # Extract the email address(es) involved in this unsubscribe event
            # Normally found under 'mail' -> 'destination' in SES notification JSON
            emails_to_suppress = []
            
            if 'mail' in sns_message and 'destination' in sns_message['mail']:
                emails_to_suppress.extend(sns_message['mail']['destination'])
            
            # Clean up potentially empty values and avoid duplicates
            emails_to_suppress = list(set([str(e).strip() for e in emails_to_suppress if e]))
            
            for email in emails_to_suppress:
                logger.info(f"Adding {email} to SES Account-Level Suppression List...")
                
                # Use Amazon SES v2 API to add to the account-level suppression list.
                # The SES v2 API accepts two Reasons: 'BOUNCE' or 'COMPLAINT'.
                # We use 'COMPLAINT' to functionally enforce an absolute block on future sending.
                response = ses_client.put_suppressed_destination(
                    EmailAddress=email,
                    Reason='COMPLAINT'
                )
                logger.info(f"Successfully suppressed {email}: {json.dumps(response)}")
                
        except Exception as e:
            logger.error(f"Error processing record: {str(e)}")
            # Raise the exception so Lambda records a failure and can optionally retry
            raise
            
    return {
        'statusCode': 200,
        'body': json.dumps('Processed SES unsubscribe events successfully.')
    }
