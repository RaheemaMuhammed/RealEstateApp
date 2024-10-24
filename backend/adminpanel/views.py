from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from authentication.models import CustomUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from property.permissions import IsStaff
from .serializers import *
from property.models import Property,Contract,Profile
from property.serializers import ExtendedPropertySerializer
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
# Create your views here.



class UserList(generics.ListAPIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaff] 
    queryset = CustomUser.objects.filter(is_staff=False)
    serializer_class = UserSerializer
    def get(self, request, *args, **kwargs):
        users = self.get_queryset()
        user_data = []
        for user in users:
            user_info = {
                'email': user.email,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'user_type': user.profile.user_type if hasattr(user, 'profile') else 'regular', 
                'name': user.profile.name if hasattr(user, 'profile') else user.get_full_name(),  
                'phone': user.profile.phone if hasattr(user, 'profile') else 'N/A'   
            }
            user_data.append(user_info)
        return Response(user_data)
    
class PropertyList(generics.ListAPIView):
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaff] 
    queryset = Property.objects.filter()
    serializer_class = ExtendedPropertySerializer



class AnalyticsView(APIView):
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsStaff] 
    def get(self, request):
        current_date = timezone.now()
        last_7_days = current_date - timedelta(days=7)
        previous_7_days = last_7_days - timedelta(days=7)

        # Total Users (users who have ever logged in)
        total_users = CustomUser.objects.count()

     
        # Total Property Listers (users with a profile)
        total_property_listers = Profile.objects.count()
        total_property_listers_previous = Profile.objects.filter(created_at__lt=last_7_days).count()

        # Total Properties
        total_properties = Property.objects.count()
        total_properties_previous = Property.objects.filter(created_at__lt=last_7_days).count()

        # Total Completed Contracts
        total_completed_contracts = Contract.objects.filter(
            Q(status='completed')
        ).count()
        total_completed_contracts_previous = Contract.objects.filter(
            Q(created_at__lt=last_7_days) & (Q(status='completed') )
        ).count()

        # Calculate percentage growth/decline
        def calculate_growth(current, previous):
            if previous == 0:  # To avoid division by zero
                return 100.0 if current > 0 else 0.0
            return ((current - previous) / previous) * 100

        lister_growth = calculate_growth(total_property_listers, total_property_listers_previous)
        property_growth = calculate_growth(total_properties, total_properties_previous)
        contract_growth = calculate_growth(total_completed_contracts, total_completed_contracts_previous)

        # Prepare the response
        data = {
            'total_users': total_users,
            'total_property_listers': total_property_listers,
            'lister_growth_percentage': lister_growth,
            'total_properties': total_properties,
            'property_growth_percentage': property_growth,
            'total_completed_contracts': total_completed_contracts,
            'contract_growth_percentage': contract_growth,
        }

        return Response(data)