

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .models import Contract
from .utils import download_signed_contract


@csrf_exempt  # Exempt from CSRF verification since it's an external service
@api_view(['POST'])  # Restrict this view to only POST requests
def docusign_webhook(request):
    try:
        # Parse the incoming JSON payload
        data = json.loads(request.body)

        # Log the incoming data for debugging (optional)
        print("Received webhook data:", data)

        # Extract envelope ID and status
        envelope_status = data['envelopeStatus']['status']
        envelope_id = data['envelopeId']

        # Check if the envelope status is 'completed'
        if envelope_status == 'completed':
            # Find the corresponding contract using the envelope_id
            contract = Contract.objects.get(envelope_id=envelope_id)
            if download_signed_contract(envelope_id) : 

                contract.status = 'completed'
                contract.save()

            # Optionally download the signed document if needed

                return JsonResponse({'status': 'success'}, status=200)

        # If status is not completed, respond with a message
        return JsonResponse({'status': 'ignored', 'message': 'Envelope not completed'}, status=200)

    except Contract.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Contract not found'}, status=404)
    except Exception as e:
        print(f"Error processing webhook: {e}")
        return JsonResponse({'status': 'error', 'message': 'Internal server error'}, status=500)