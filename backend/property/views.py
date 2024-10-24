from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView,RetrieveUpdateAPIView,RetrieveAPIView,ListAPIView
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError
from rest_framework.status import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.db.models import Q, F 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from datetime import timedelta
from .permissions import *
from .utils import create_docusign_contract

# Create your views here.
class ListingProfileView(APIView):
    def post(self,request):
        pass
    def get(self,request):
        pass
    def patch(self,request):
        pass

class ListingProfileCreateView(CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        
        if Profile.objects.filter(user=self.request.user).exists():
            raise ValidationError("Profile already exists.")
        serializer.save(user=self.request.user)

class ListingProfileDetailView(RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        p=Profile.objects.get(user=self.request.user)
        print(p)
        return Profile.objects.get(user=self.request.user)
    
class PropertyListingView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]



    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        print(profile)
        serializer = PropertySerializer(data=request.data)
        
        if serializer.is_valid():
            property_instance = serializer.save(owner=profile)
            return Response({
                'pk': property_instance.pk,
                'message': 'Property created successfully!',
                'data': serializer.data
            }, status=HTTP_201_CREATED)
        
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        property_id = request.query_params.get('property_id')
        
        if property_id:
            try:
                property_instance = Property.objects.get(pk=property_id, owner=profile)
                serializer = ExtendedPropertySerializer(property_instance)
                return Response(serializer.data, status=HTTP_200_OK)
            except Property.DoesNotExist:
                return Response({"error": "Property not found or you do not have permission"}, status=HTTP_404_NOT_FOUND)
        
        
        properties = Property.objects.filter(owner=profile)
        
        serializer = ExtendedPropertySerializer(properties, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    
class SaleListingView(CreateAPIView):
    queryset = SaleListing.objects.all()
    serializer_class = SaleListingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        property_instance = Property.objects.get(pk=self.kwargs['pk'])
        serializer.save(property=property_instance)

class LeaseListingView(CreateAPIView):
    queryset = LeaseListing.objects.all()
    serializer_class = LeaseListingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        property_instance = Property.objects.get(pk=self.kwargs['pk'])
        serializer.save(property=property_instance)

class RentListingView(CreateAPIView):
    queryset = RentListing.objects.all()
    serializer_class = RentListingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        property_instance = Property.objects.get(pk=self.kwargs['pk'])
        serializer.save(property=property_instance)


class PropertyDetailsView(RetrieveAPIView):
    queryset = Property.objects.all()

    serializer_class = PropertySerializer

    def get_object(self):
        pk = self.kwargs.get('pk')
        
        return Property.objects.get(pk=pk)
    

class PropertyListView(ListAPIView):
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = {
        'price': ['gte', 'lte'],
        'property_type': ['exact'],
        'number_of_bathrooms': ['exact', 'gte'],
        'number_of_bedrooms': ['exact', 'gte'],
        'location': ['icontains'],
        'area': ['gte', 'lte'],
    }
    ordering_fields = ['price', 'area', 'created_at']

    def get_queryset(self):
        queryset = Property.objects.all()
        listing_type = self.request.query_params.get('type') 
        price_min = self.request.query_params.get('priceMin')
        price_max = self.request.query_params.get('priceMax') 

        if listing_type == 'buy':
            queryset = queryset.filter(sale_listings__is_active=True)
            if price_min or price_max:
                queryset = queryset.annotate(
                    listing_price=F('sale_listings__price')
                ).filter(
                    listing_price__gte=price_min or 0,
                    listing_price__lte=price_max or 10**10
                )
        elif listing_type == 'lease':
            queryset = queryset.filter(lease_listings__is_active=True)
            if price_min or price_max:
                queryset = queryset.annotate(
                    listing_price=F('lease_listings__price_per_month')
                ).filter(
                    listing_price__gte=price_min or 0,
                    listing_price__lte=price_max or float('inf')
                )
        elif listing_type == 'rent':
            queryset = queryset.filter(rent_listings__is_active=True)
            if price_min or price_max:
                queryset = queryset.annotate(
                    listing_price=F('rent_listings__price_per_month')
                ).filter(
                    listing_price__gte=price_min or 0,
                    listing_price__lte=price_max or 10**10
                )

        
        queryset = self.apply_filters(queryset)

        return queryset

    def apply_filters(self, queryset):
        bathrooms = self.request.query_params.get('bathrooms')
        bedrooms = self.request.query_params.get('bedrooms')
        property_type = self.request.query_params.get('propertyType')
        location = self.request.query_params.get('location')
        area_min = self.request.query_params.get('areaMin')
        area_max = self.request.query_params.get('areaMax')

       
        if bathrooms:
            queryset = queryset.filter(number_of_bathrooms__gte=bathrooms)
        if bedrooms:
            queryset = queryset.filter(number_of_rooms__gte=bedrooms)
        if property_type:
            queryset = queryset.filter(property_type=property_type)
        if location:
            queryset = queryset.filter(address__icontains=location)
        if area_min:
            queryset = queryset.filter(area__gte=area_min)
        if area_max:
            queryset = queryset.filter(area__lte=area_max)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    

class CallRequestView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    def patch(self,request):
        try:
            
            call_request_id = request.data.get('call_request_id')
            new_status = request.data.get('status')

            if not call_request_id or not new_status:
                return Response({'error': 'CallRequest ID and new status are required', 'status': 400})

            call_request = CallRequest.objects.get(id=call_request_id)

           
            if new_status not in ['pending', 'success', 'failed']:
                return Response({'error': 'Invalid status', 'status': 400})

            call_request.status = new_status
            call_request.save()

             #If status is success, do contract creation
            if new_status == 'success':
                template = DocuSignTemplate.objects.filter(listing_type=call_request.listing_type)[0]
                print(template,'----template')
                contract = Contract.objects.create(
                    listing_type=call_request.listing_type,
                    property=call_request.property,
                    buyer_or_renter=call_request.requested_by,
                    owner_or_agent=call_request.lister,
                    template=template  
                )
                print(contract,'-----contract')

                # 2. Fetch and Populate the DocuSign Template
                
                try:
                    docusign_url = create_docusign_contract(contract)
                    print(docusign_url)
                    contract.docu_sign_url = docusign_url
                    contract.save()
                except Exception as e:
                    return Response({'error': 'Failed to create DocuSign contract', 'details': str(e)}, status=500)

                
                # notify_admin(contract)

            return Response({'status': 200, 'message': 'Request status updated and contract processed'}, status=200)

                  
        except Exception as e:
            return Response({'error':str(e),'status':400})

    def get(self,request):
        try: 
             property_id = request.query_params.get('property_id')
            
             if not property_id:
                return Response({'error': 'property_id is required'}, status=HTTP_400_BAD_REQUEST)
             
             call_requests = CallRequest.objects.filter(property=property_id)
             serializer = CallRequestSerializer(call_requests,many=True)
             return Response({'payload':serializer.data,'status':200})

        except Exception as e:
                    return Response({'error':str(e),'status':400})

    def post(self,request):
        try:
            data = request.data.copy()
            user = request.user
            data['requested_by'] = user.id
            property_id = data.get('property_id')
            property_listed = get_object_or_404(Property, pk=property_id)
            data['property'] = property_listed.id
            data['lister'] = property_listed.owner.id
            

            serializer = CallRequestSerializer(data=data)
            if serializer.is_valid():
                call_request = serializer.save()
                notification_content="You have a call request"
                notif = Notification.objects.create(user=property_listed.owner.user,content=notification_content,notification_type='call_request',call_request=call_request)

                try:
                    channel_layer = get_channel_layer()
                    lister_channel_name = f"user_{property_listed.owner.user.id}"
                    async_to_sync(channel_layer.group_send)(
                        lister_channel_name,
                        {
                            "type": "send_notification",
                            "notification": {
                                "content": notification_content,
                                "notification_type": "call_request",
                                
                                "is_read": False,
                            },
                        }
                    )
                except Exception as e:
                    print(f"WebSocket Error: {str(e)}")
                return Response({'message': 'Request sent successfully'}, status=200)

            return Response({'message': 'Invalid Data', 'errors': serializer.errors}, status=400)

        except Property.DoesNotExist:
            return Response({'message': 'Property not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        

class NotificationView(APIView):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated] 
        def get(self,request):
             try:
                  
                    five_days_ago = timezone.now() - timedelta(days=5)
            
                    notifs = Notification.objects.filter(user=request.user, created_at__gte=five_days_ago).order_by('-created_at')
                    
                         
                    serializer=NotificationSerializer(notifs,many=True)
                    
                    return Response({'payload':serializer.data,'status':200})
             except Exception as e:
                    return Response({'error':str(e),'status':400})
             
        # mark as read
        def patch(self,request):
             try:
                  notifs=Notification.objects.filter(user=request.user ,is_read=False)
                  for noti in notifs:
                       noti.is_read=True
                       noti.save()
                  return Response({'status':200,'message':'Marked notifications as read'})
             except Exception as e:
                  return Response({'error':str(e),'status':400})
             
class SavedPropertiesView(APIView):
    
      authentication_classes = [JWTAuthentication]
      permission_classes = [IsAuthenticated]

      def get(self,request):
           try:
                user=request.user
                saved_properties=SavedProperties.objects.filter(user_id=user.id)
                property_ids=saved_properties.values_list('property_id',flat=True)
                properties=Property.objects.filter(pk__in=property_ids)
                serializer=PropertySerializer(properties,many=True)
                return Response({'payload':serializer.data,'status':200})
           except Exception as e:
                return Response({'error':str(e)})
           

      def patch(self,request):
            try:
                data=request.data
                property_id=data.get('property_id')
                type=data.get('type')
                property=Property.objects.get( pk=property_id)

                if property_id is not None:
                        user=request.user
                        try:
                            saved_property=SavedProperties.objects.get(user_id=user,property_id=property_id,listing_type=type)
                            saved_property.delete()
                            
                            return Response({'status':200,'message':'property Removed Successfully'})
                        except SavedProperties.DoesNotExist :
                            
                            SavedProperties.objects.create(user_id=user,property_id=property,listing_type=type)
                            
                            return Response({'status':200,'message':'property Added to Saved List Successfully'})
            except Exception as e:
                return Response({'error':str(e)})

class OwnedPropertiesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        owned_properties = Property.objects.filter(
            contracts__buyer_or_renter=user,
            contracts__status='completed'
        ).distinct()  

        response_data = []

        for property in owned_properties:
            property_data = PropertySerializer(property).data

            completed_contract = property.contracts.filter(
                buyer_or_renter=user,
                status='completed'
            ).first()

            if completed_contract and completed_contract.signed_contract_file:
                property_data['signed_contract_file'] = completed_contract.signed_contract_file.url
            else:
                property_data['signed_contract_file'] = None

            response_data.append(property_data)

        return Response(response_data)
class PipelinePropertiesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get properties where the contract is pending, and the user is the buyer or renter
        pipeline_properties_contract = Property.objects.filter(
            contracts__buyer_or_renter=user,
            contracts__status='pending'
        )

        pipeline_properties_call_request = Property.objects.filter(
            call_requests__requested_by=user
        )

        pipeline_properties = pipeline_properties_contract.union(pipeline_properties_call_request)

        serialized_properties = []
        
        for property in pipeline_properties:
            # Check if the property is part of a contract
            if property in pipeline_properties_contract:
                pipeline_stage = 'Contract Initiated'
            else:
                pipeline_stage = 'Callback Requested'
            
            # Serialize the property and add the 'pipeline_stage' key
            property_data = PropertySerializer(property).data
            property_data['pipeline_stage'] = pipeline_stage
            serialized_properties.append(property_data)

        return Response(serialized_properties)
class ContractTemplates(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        try:
            print(request.data)
            serializer = DocuSignTemplateSerializer(data = request.data)
            if serializer.is_valid():
                tem=serializer.save()
                print(tem.is_active)
                return Response({'message': 'Template addedd successfully'}, status=200)

            return Response({'message': 'Invalid Data', 'errors': serializer.errors}, status=400)
        except Exception as e:
            return Response({'error':str(e)})
        

    def get(self,request):
        try:
            templates = DocuSignTemplate.objects.all()
            serializer = DocuSignTemplateSerializer(templates,many=True)
            return Response({'payload':serializer.data,'status':200})

        except Exception as e:
            return Response({'error':str(e)})
        
class ContractsView(APIView):
    def get(self, request):
        """Fetch all contracts with 'pending' status."""
        pending_contracts = Contract.objects.filter(status='pending')
        serializer = ContractSerializer(pending_contracts, many=True, context={'request': request})
        return Response(serializer.data, status=200)

    def patch(self, request, *args, **kwargs):
        """Update the status of a specific contract."""
        contract_id = request.data.get('contract_id')
        status_choice = request.data.get('status')
        rejection_reason = request.data.get('rejection_reason', '')

        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            return Response({'error': 'Contract not found'}, status=404)

        if status_choice == 'approved':
            contract.status = 'approved'
            contract.save()
            return Response({'message': 'Contract approved'}, status=200)
        
        elif status_choice == 'rejected':
            contract.status = 'rejected'
            contract.rejection_reason = rejection_reason
            contract.save()
            return Response({'message': 'Contract rejected'}, status=200)
        
        return Response({'error': 'Invalid status'}, status=400)
    


