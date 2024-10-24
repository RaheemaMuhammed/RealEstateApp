import os
from docusign_esign import ApiClient, EnvelopesApi,TemplateRole,PrefillTabs, EnvelopeDefinition,Tabs,Text,SignHere,EventNotification,EnvelopeEvent
from docusign_esign.client.api_exception import ApiException
import time
from backend.settings import (
    DOCUSIGN_ACCOUNT_ID,
    DOCUSIGN_BASE_URL,
    DOCUSIGN_CLIENT_ID,
    DOCUSIGN_REDIRECT_URI,
    DOCUSIGN_PRIVATE_KEY_PATH,
    DOCUSIGN_USER_ID,
    DS_BASE_URI,
    FRONTEND_URL,
    DS_WEBHOOK_URL
)
import json
import requests
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
# Initialize the API client globally
api_client = ApiClient()
access_token = None
token_expiration_time = None
token_obj = None

class TokenObject:
    def __init__(self, access_token):
        self.access_token = access_token

def get_access_token():
    print('gettingg token')
    global access_token, token_expiration_time, token_obj
    
    # Read the private key
    try:
        with open(DOCUSIGN_PRIVATE_KEY_PATH, 'r') as key_file:
            private_key = key_file.read()
    except Exception as e:
        raise Exception(f"Error reading private key: {e}")

    try:
        # Request JWT User Token
        token_response = api_client.request_jwt_user_token(
            client_id=DOCUSIGN_CLIENT_ID,
            user_id=DOCUSIGN_USER_ID,
            private_key_bytes=private_key.encode(),
            oauth_host_name=DOCUSIGN_BASE_URL,
            expires_in=3600,
            scopes=["signature", "impersonation"]
        )
        token_obj = TokenObject(token_response.access_token)
        access_token = token_response.access_token
        token_expiration_time = time.time() + 3600  # Set expiration time
        print("New token acquired successfully!")

        return token_obj
    except ApiException as e:
        print(f"DocuSign API exception: {e}")
        print(f"Error response: {e.body}")
        raise Exception(f"DocuSign API exception: {e}")
    except Exception as e:
        raise Exception(f"Error during DocuSign token retrieval: {e}")


def check_token():
    global token_obj, token_expiration_time

    # Check if the token is valid
    if token_obj and (time.time() < token_expiration_time):
        print('token freshhh')
        return token_obj
    
    # If not valid, retrieve a new token
    return get_access_token()

def create_sign_here_tab(x_position, y_position, document_id="1", page_number="1"):
    """Creates a SignHere tab at the given position."""
    return [SignHere(
        x_position=str(x_position),
        y_position=str(y_position),
        document_id=document_id,
        page_number=page_number
    )]

def create_text_tabs(contract):
    """Create text tabs for the DocuSign contract using Text class."""
    return [
        Text(
            tab_label="Seller Name",
            value=contract.owner_or_agent.name,
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Seller Phone Number",
            value=contract.owner_or_agent.phone,
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Seller Email",
            value=contract.owner_or_agent.email,
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Buyer Email",
            value=contract.buyer_or_renter.email,
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Property Address",
            value=contract.property.description,
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Property Description",
            value=contract.property.description,
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Property Type",
            value=contract.property.property_type,
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Property Area",
            value=str(contract.property.area),
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Sale Price",
            value=str(contract.property.sale_listings.first().price),
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Listing Conditions",
            value=contract.property.sale_listings.first().conditions,
            document_id="1",
            page_number="1"
        )
    ]

def create_template_role(role_name, name, email, sign_here_tab, text_tabs,prefill_tabs):
    """Create a TemplateRole with provided SignHere and Text tabs."""
    return TemplateRole(
        role_name=role_name,
        name=name,
        email=email,
        tabs=Tabs(
            sign_here_tabs=sign_here_tab,
            text_tabs=text_tabs,
            prefill_tabs=prefill_tabs
        )
    )
def create_prefill_tabs(contract):
    """Creates prefill tabs for fields that should be auto-filled by the sender."""
    return PrefillTabs(
        text_tabs=[
            Text(
                tab_label="Seller Name",
                value=contract.owner_or_agent.name,
                document_id="1",
                page_number="1"
            ),
            Text(
                tab_label="Buyer Email",
                value=contract.buyer_or_renter.email,
                document_id="1",
                page_number="1"
            ),
            Text(
            tab_label="Property Address",
            value=contract.property.address,
            document_id="1",
            page_number="1"
        ),
        Text(
            tab_label="Property Deyscription",
            value=contract.property.description,
            document_id="1",
            page_number="1"
        ),
        
        Text(
            tab_label="Sale Price",
            value=str(contract.property.sale_listings.first().price),
            document_id="1",
            page_number="1"
        )
           
        ]
    )
def create_envelope_definition(contract):
    """Creates the envelope definition for the DocuSign contract."""
    text_tabs = create_text_tabs(contract)
    prefill_tabs = create_prefill_tabs(contract)
   
    return EnvelopeDefinition(
        email_subject="Please sign the contract",
        template_id=contract.template.template_id,
        template_roles=[
            create_template_role(
                role_name="Buyer",
                name=contract.buyer_or_renter.get_full_name(),
                email=contract.buyer_or_renter.email,
                sign_here_tab=create_sign_here_tab(100, 150),
                text_tabs=text_tabs,
                prefill_tabs=prefill_tabs
            ),
            create_template_role(
                role_name="Seller",
                name=contract.owner_or_agent.name,
                email=contract.owner_or_agent.email,
                sign_here_tab=create_sign_here_tab(100, 300),
                text_tabs=text_tabs,
                prefill_tabs=prefill_tabs
            )
        ],
        # prefill_tabs=prefill_tabs,
        
        status="sent"
    )


def create_docusign_contract(contract):
    """Create a DocuSign contract based on the given contract object."""
    # Retrieve access token
    token_obj = check_token()  # Ensure we get a valid access token
    
    
    
    # Set up the client with the access token
    
    api_client.host = DS_BASE_URI + "/restapi"
    # For production and go-live, use OAuth to obtain the access token and account_id
    api_client.set_default_header("Authorization", "Bearer " + token_obj.access_token)


    
    # Initialize the Envelopes API
    envelopes_api = EnvelopesApi(api_client)
    
    # Prepare the envelope definition using the contract template
    envelope_definition = create_envelope_definition(contract)

    with open("envelope_definition_log.json", "w") as log_file:
            json.dump(envelope_definition.to_dict(), log_file, indent=2)
    print("Envelope definition logged to envelope_definition_log.json")
    event_notification = EventNotification(
    url=DS_WEBHOOK_URL,  
    logging_enabled=True,
    envelope_events=[
        EnvelopeEvent(envelope_event_status_code="completed")
    ],
    include_document_fields=True
)
    # envelope_definition.event_notification=event_notification  

    try:
    
        # Create the envelope
        response = envelopes_api.create_envelope(account_id=DOCUSIGN_ACCOUNT_ID, envelope_definition=envelope_definition)
        return response.envelope_id  # Return the envelope ID or URL
    except ApiException as e:
        print(f"An error occurred while creating the envelope: {e}")
        print(f"Error response: {e.body}")
        # Log the envelope definition for debugging
        raise e
    


def generate_docusign_preview_url(envelope_id, admin_email, admin_name):
    """Generates a preview URL for a DocuSign envelope based on its envelope ID."""
    # Ensure access token is fresh
    token_obj = check_token()

    # Base URL for DocuSign environment
    preview_endpoint = f"{DS_BASE_URI}/restapi/v2.1/accounts/{DOCUSIGN_ACCOUNT_ID}/envelopes/{envelope_id}/views/recipient"

    headers = {
        "Authorization": f"Bearer {token_obj.access_token}",
        "Content-Type": "application/json",
    }

    # Payload to generate the recipient view URL
    payload = {
        "authenticationMethod": "none",
        "email": admin_email,  # Admin email
        "userName": admin_name,  # Admin name
        "recipientId": "1",  # You can adjust the recipient ID based on the role
        "returnUrl": f"{FRONTEND_URL}/admin/contracts/preview_return",  # URL to redirect after preview
    }

    try:
        response = requests.post(preview_endpoint, headers=headers, json=payload)
        if response.status_code == 201:
            return response.json().get("url")  
        else:
            raise Exception(f"Failed to generate preview URL: {response.content}")
    except Exception as e:
        print(f"Error generating DocuSign preview URL: {e}")
        raise e


def download_signed_contract(envelope_id, contract):
    token_obj = check_token()

    # Replace with your DocuSign API endpoint
    url =  f"{DS_BASE_URI}/restapi/v2.1/accounts/v2.1/accounts/{DOCUSIGN_ACCOUNT_ID}/envelopes/{envelope_id}/documents/1"
    
    headers = {
        "Authorization": f"Bearer {token_obj.access_token}",
        "Accept": "application/pdf",
    }
    
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        # Save the signed document to the Contract model
        file_name = f"contract_{contract.id}.pdf"
        file_path = default_storage.save(f"contracts/{file_name}", ContentFile(response.content))
        contract.signed_contract_file = file_path
        contract.save()
        
        return True  # Indicate success
    else:
        print(f"Failed to download signed contract: {response.status_code}, {response.text}")
        return False  # Indicate failure