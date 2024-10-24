import os
from django.core.management.base import BaseCommand
from docusign_esign import ApiClient, EnvelopesApi, EnvelopeDefinition, Document, Signer, SignHere, Tabs, Recipients
from dotenv import load_dotenv
from backend.settings import DOCUSIGN_ACCOUNT_ID, DOCUSIGN_BASE_URL
from docusign_esign.client.api_exception import ApiException
import requests
# Hardcoded token for simplicity
HARDCODED_ACCESS_TOKEN = "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCA3IFJbfPcSAgAgERGq3Xz3EgCADosTuEddWBMqKXb7SCSyAQVAAEAAAAYAAIAAAAFAAAAHQAAAA0AJAAAADRiMjg2MzIzLWIwNzMtNDZkZS1iMTAxLWM2ZGRhMjU1MzExZCIAJAAAADRiMjg2MzIzLWIwNzMtNDZkZS1iMTAxLWM2ZGRhMjU1MzExZBIAAQAAAAYAAABqd3RfYnIjACQAAAA0YjI4NjMyMy1iMDczLTQ2ZGUtYjEwMS1jNmRkYTI1NTMxMWQ.uO8nIBavl93lPzN2ygfY4q-i3stTfskHV3_fuRROboCUv3JpEcAc88glgO-RmDsc6-q9x6ARRaGzPXqwwGNLPBOMflD3_7250ko2RbAGYJ2KQSXaR-5FzAjoMbH40-qkUVrPClEhcj5PjWiL5LOM8LbMBRWiOax0KJZv0lEqqjPNe2mRUjyVBquD5sCFo-kTiNEQVVW7JrFJeDOitTWEhnOmhkl8LCA7k5EGbWVZJjYwQyP0b-LNrSNOk-SKPrPgCOYvMe3yFu-IOIdYE2ctYck8GT9-JOQf77y7BW7tbAb56jcFlqwbEeVWCy5Vg6a-gt8qYHergS0tQ5Zq68YBRA"

class Command(BaseCommand):
    help = 'Send an envelope using DocuSign'

    def handle(self, *args, **kwargs):
        try:
            url = f'https://demo.docusign.net/restapi/v2.1/accounts/{DOCUSIGN_ACCOUNT_ID}/envelopes/f71e2387-7742-4d34-b28e-8a30822fe492'
            headers = {
                'Authorization': f'Bearer {HARDCODED_ACCESS_TOKEN}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                self.stdout.write(self.style.SUCCESS(f"Envelope sent successfully! Envelope ID: {response.json()}"))
                  # Envelope details, including document info
            else:
                print(f"Error fetching envelope details: {response.text}")
               



        except ApiException as e:
                if hasattr(e, 'body'):
                    self.stdout.write(self.style.ERROR(f"Error response body: {e.body}"))
                self.stdout.write(self.style.ERROR(f"Error sending envelope: {e}"))
        
    # def create_envelope(self):
        """
        Create an envelope with a single document and a single signer.
        """
        # Define the document
        document = Document(
            document_base64="VGhpcyBpcyBhIHRlc3QgZG9jdW1lbnQu",  # Base64 encoded document
            name="Sample Document",  # Name of the document in the envelope
            file_extension="pdf",
            document_id="1"
        )

        # Create a signer
        signer = Signer(
            email="dimifo8677@avzong.com",  # Change this to the recipient's email
            name="Recipient Name",
            recipient_id="1",
            routing_order="1"
        )

        # Create a SignHere tab (where the recipient will sign)
        sign_here = SignHere(
            document_id="1",
            page_number="1",
            recipient_id="1",
            tab_label="SignHereTab",
            x_position="100",
            y_position="150"
        )

        # Create the tabs object and assign the SignHere tab
        tabs = Tabs(sign_here_tabs=[sign_here])

        # Add tabs to the signer
        signer.tabs = tabs

        # Create a Recipients object and assign the signer
        recipients = Recipients(signers=[signer])

        # Create the envelope definition
        envelope_definition = EnvelopeDefinition(
            email_subject="Please sign this document",
            documents=[document],
            recipients=recipients,
            status="sent"  # Send immediately
        )

        return envelope_definition
