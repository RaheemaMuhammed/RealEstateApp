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
        return Profile.objects.get(user=self.request.user)
    
class PropertyListingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        serializer = PropertySerializer(data=request.data)
        
        if serializer.is_valid():
            property_instance = serializer.save(owner=profile)
            return Response({
                'pk': property_instance.pk,
                'message': 'Property created successfully!',
                'data': serializer.data
            }, status=HTTP_201_CREATED)
        
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
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
        print(pk)
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