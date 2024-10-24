import os
import time  # For checking token expiry time
from django.core.management.base import BaseCommand
from docusign_esign import ApiClient
from docusign_esign.client.api_exception import ApiException
from dotenv import load_dotenv
from backend.settings import DOCUSIGN_ACCOUNT_ID,DOCUSIGN_BASE_URL,DOCUSIGN_CLIENT_ID,DOCUSIGN_REDIRECT_URI,DOCUSIGN_PRIVATE_KEY_PATH,DOCUSIGN_USER_ID
# Global variables for token storage
access_token = None
token_expiration_time = None  # Store expiration time of token


class Command(BaseCommand):
    help = 'Check DocuSign integration'

    def handle(self, *args, **kwargs):
        # Load environment variables
        load_dotenv()

        base_url = os.getenv('DOCUSIGN_BASE_URL')

        # Read the private key
        try:
            with open(DOCUSIGN_PRIVATE_KEY_PATH, 'r') as key_file:
                private_key = key_file.read()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error reading private key: {e}"))
            return

        # Check if the token is still valid before making any API requests
        if self.is_token_valid():
            self.stdout.write(self.style.SUCCESS(f"Using existing valid token."))
        else:
            self.stdout.write(self.style.WARNING(f"Token is expired or missing, requesting a new one..."))
            # Request a new token if not valid
            if not self.get_new_token(DOCUSIGN_CLIENT_ID, DOCUSIGN_USER_ID, private_key, DOCUSIGN_BASE_URL):
                return  # Stop execution if token retrieval fails

        # Proceed with API operations using the valid token
        try:
            api_client = ApiClient()

            # Retrieve user info
            user_info = api_client.get_user_info(access_token)
            account_id = user_info.accounts[0].account_id
            base_uri = user_info.accounts[0].base_uri
            # Output user info
            self.stdout.write(self.style.SUCCESS(f"DocuSign integration successful! User Info: {user_info}"))
            self.stdout.write(self.style.SUCCESS(f"{account_id}"))
            self.stdout.write(self.style.SUCCESS(f"{base_uri}"))

        except ApiException as e:
            self.stdout.write(self.style.ERROR(f"DocuSign API exception: {e}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error during DocuSign integration: {e}"))

    def is_token_valid(self):
        """
        Check if the token is still valid based on the expiration time.
        """
        global token_expiration_time
        if access_token and token_expiration_time and (time.time() < token_expiration_time):
            return True
        return False

    def get_new_token(self, DOCUSIGN_CLIENT_ID, DOCUSIGN_USER_ID, private_key, DOCUSIGN_BASE_URL):
        """
        Request a new token and set its expiration time.
        """
        global access_token, token_expiration_time

        try:
            # Initialize API Client
            api_client = ApiClient()

            # Request JWT User Token
            token_response = api_client.request_jwt_user_token(
                client_id=DOCUSIGN_CLIENT_ID,
                user_id=DOCUSIGN_USER_ID,
                private_key_bytes=private_key.encode(),
                oauth_host_name=DOCUSIGN_BASE_URL,
                expires_in=3600,  # Token valid for 1 hour
                scopes=["signature", "impersonation"]
            )

            # Set the global token and expiration time
            access_token = token_response.access_token
            self.stdout.write(self.style.SUCCESS(f"{access_token}"))

            token_expiration_time = time.time() + 3600  # Current time + token lifespan

            self.stdout.write(self.style.SUCCESS(f"New token acquired successfully!"))
            return True

        except ApiException as e:
            self.stdout.write(self.style.ERROR(f"DocuSign API exception while requesting token: {e}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error while requesting token: {e}"))
        
        return False
