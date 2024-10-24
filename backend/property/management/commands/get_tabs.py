import os
from django.core.management.base import BaseCommand
from docusign_esign import ApiClient, TemplatesApi, Configuration

from backend.settings import DOCUSIGN_ACCOUNT_ID
class Command(BaseCommand):
    help = 'Retrieve DocuSign envelope tabs'

    def handle(self, *args, **kwargs):
        # DocuSign API credentials and envelope info
        account_id = DOCUSIGN_ACCOUNT_ID
        template_id = "c5b3bc50-8aa1-4291-9066-f1fe585ac1a4"  # Provide the envelope ID here or set it in the environment variables
        access_token = "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCAObnJj_PcSAgAgKF9K5jz3EgCADosTuEddWBMqKXb7SCSyAQVAAEAAAAYAAIAAAAFAAAAHQAAAA0AJAAAADRiMjg2MzIzLWIwNzMtNDZkZS1iMTAxLWM2ZGRhMjU1MzExZCIAJAAAADRiMjg2MzIzLWIwNzMtNDZkZS1iMTAxLWM2ZGRhMjU1MzExZBIAAQAAAAYAAABqd3RfYnIjACQAAAA0YjI4NjMyMy1iMDczLTQ2ZGUtYjEwMS1jNmRkYTI1NTMxMWQ.MOV48MR6WtVX4pFJ9TvoC7Oz3zkspyUE5dJrsCMkjZiROO7wXSvEzoG9rND-gCkKYB912iooQnPycAxORFpWWSrLkzQAw4F3kU6xT1KDgHNL5ncghwMQyesuu_2NtXsR4K2Ukow9kb8XMUjJvMBAkF_qemynEwWbRwDhOJSXJ5w9uKjybiHSgyFhLvCPtct5GnesXGunUy6bERdFR5Xeqg86ZkfMxPW3zIl_XMo0UBS7GZgPhcnl-SzUr0yVOhz75uJI-Fng_RTtaNFeBMWeqzevb4KRn-qBVYZ8MXCF0jAth8jNh53Fsnu4YnIvgkkEBvNyumnKCz8pLw52oT4YzA"

        # Set up DocuSign API client
        configuration = Configuration()
        configuration.host = "https://demo.docusign.net/restapi"
        api_client = ApiClient()

        configuration.access_token = access_token
        api_client.host = "https://demo.docusign.net/restapi"
    # For production and go-live, use OAuth to obtain the access token and account_id
        api_client.set_default_header("Authorization", "Bearer " + access_token)

        templates_api = TemplatesApi(api_client)

       
        try:
            # List templates to ensure you're connected
            templates = templates_api.list_templates(account_id=account_id)
            self.stdout.write(self.style.SUCCESS("Templates available:"))
            for template in templates.envelope_templates:
                self.stdout.write(f"Template ID: {template.template_id}, Name: {template.name}")

            recipients = templates_api.list_recipients(account_id=account_id,template_id=template_id)
            # self.stdout.write(self.style.SUCCESS(f"Reciepients available:{recipients}"))
            # for rec in recipients:
            #     self.stdout.write(f"rec ID: {rec.reciepient_id}, Name: {rec.name}")


            # Assuming you know your template ID, get the template details
            # template = templates_api.get_template(account_id=account_id, template_id=template_id)  # If this method works

            # Output recipient details
            self.stdout.write(self.style.SUCCESS("Recipients:"))
            recipient_ids = ['72726573','51904455']
            # for recipient in template.recipients.signers:
            #     self.stdout.write(f"Name: {recipient.name}, Email: {recipient.email}, Recipient ID: {recipient.recipient_id}")
            #     recipient_ids.append(recipient.recipient_id)

            # Get tabs for each recipient
            for recipient_id in recipient_ids:
                tabs = templates_api.list_tabs(account_id=account_id, template_id=template_id, recipient_id=recipient_id)

                # Output the tabs for inspection
                self.stdout.write(self.style.SUCCESS(f"Tabs for {recipient_id}:"))
                
                # SignHere Tabs
                if tabs.sign_here_tabs:
                    for tab in tabs.sign_here_tabs:
                        self.stdout.write(f"Tab Label: {tab.tab_label}, Tab ID: {tab.tab_id}")
                else:
                    self.stdout.write(self.style.WARNING("No SignHere tabs found."))

                # Text Tabs
                if tabs.text_tabs:
                    for tab in tabs.text_tabs:
                        self.stdout.write(f"Tab Label: {tab.tab_label}, Value: {tab.value}, Required: {tab.required}, Tab ID: {tab.tab_id}")
                else:
                    self.stdout.write(self.style.WARNING("No Text tabs found."))

                # Other tab types can be checked similarly
                other_tab_types = [
                    'approve_tabs', 'checkbox_tabs', 'comment_thread_tabs', 'phone_number_tabs',
                    'number_tabs', 'date_tabs', 'initial_here_tabs', 'full_name_tabs'
                ]
                for tab_type in other_tab_types:
                    tabs_list = getattr(tabs, tab_type, [])
                    if tabs_list:
                        self.stdout.write(self.style.SUCCESS(f"{tab_type.replace('_', ' ').capitalize()}:"))
                        for tab in tabs_list:
                            self.stdout.write(f"Tab ID: {tab.tab_id}, Tab Label: {tab.tab_label if hasattr(tab, 'tab_label') else 'N/A'}")
                    else:
                        self.stdout.write(self.style.WARNING(f"No {tab_type.replace('_', ' ')} found."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))