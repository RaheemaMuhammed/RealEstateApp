from rest_framework.serializers import ModelSerializer,SerializerMethodField
from .models import *

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user_type', 'name', 'email', 'phone']

class PropertySerializer(ModelSerializer):

    is_for_sale = SerializerMethodField()
    is_for_lease = SerializerMethodField()
    is_for_rent = SerializerMethodField()

    listing_price = SerializerMethodField()
    listing_price_per_month = SerializerMethodField()

    owner_name = SerializerMethodField()
    owner_email = SerializerMethodField()
    owner_phone = SerializerMethodField()
    is_owner = SerializerMethodField()

    sale_listing_details = SerializerMethodField()
    lease_listing_details = SerializerMethodField()
    rent_listing_details = SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id',
            'description',
            'property_type',
            'address',
            'area',
            'number_of_rooms',
            'number_of_bathrooms',
            'parking_space',
            'furnished',
            'built_at',
            'image',
            'is_for_sale',
            'is_for_lease',
            'is_for_rent',
            'listing_price',
            'listing_price_per_month',
            'owner_name',
            'owner_email',
            'owner_phone',
            'is_owner',
            'sale_listing_details',
            'lease_listing_details',
            'rent_listing_details',
        ]

    def get_is_for_sale(self, obj):
        return SaleListing.objects.filter(property=obj, is_active=True).exists()

    def get_is_for_lease(self, obj):
        return LeaseListing.objects.filter(property=obj, is_active=True).exists()

    def get_is_for_rent(self, obj):
        return RentListing.objects.filter(property=obj, is_active=True).exists()
    
    def get_listing_price(self, obj):
        if SaleListing.objects.filter(property=obj, is_active=True).exists():
            sale_listing = SaleListing.objects.filter(property=obj, is_active=True).first()
            return sale_listing.price


        return None
    def get_listing_price_per_month(self, obj):
        

        if LeaseListing.objects.filter(property=obj, is_active=True).exists():
            lease_listing = LeaseListing.objects.filter(property=obj, is_active=True).first()
            return lease_listing.price_per_month

        elif RentListing.objects.filter(property=obj, is_active=True).exists():
            rent_listing = RentListing.objects.filter(property=obj, is_active=True).first()
            return rent_listing.price_per_month

        return None
    
    def get_sale_listing_details(self, obj):
        if self.get_is_for_sale(obj):
            sale_listing = SaleListing.objects.filter(property=obj, is_active=True).first()
            return {
                'price': sale_listing.price,
                'conditions': sale_listing.conditions,
            }
        return None

    def get_lease_listing_details(self, obj):
        if self.get_is_for_lease(obj):
            lease_listing = LeaseListing.objects.filter(property=obj, is_active=True).first()
            return {
                'price_per_month': lease_listing.price_per_month,
                'deposit_amount': lease_listing.deposit_amount,
                'lease_term': lease_listing.lease_term,
                'conditions': lease_listing.conditions,
            }
        return None

    def get_rent_listing_details(self, obj):
        if self.get_is_for_rent(obj):
            rent_listing = RentListing.objects.filter(property=obj, is_active=True).first()
            return {
                'price_per_month': rent_listing.price_per_month,
                'rent_term': rent_listing.rent_term,
                'conditions': rent_listing.conditions,
            }
        return None
    
    def get_owner_name(self, obj):
        return obj.owner.name if obj.owner else None

    def get_owner_email(self, obj):
        return obj.owner.email if obj.owner else None

    def get_owner_phone(self, obj):
        return obj.owner.phone if obj.owner else None
    
    def get_is_owner(self, obj):
        return obj.owner.user_type == 'owner' if obj.owner else False

class SaleListingSerializer(ModelSerializer):
    class Meta:
        model = SaleListing
        fields = ['price', 'conditions']

class LeaseListingSerializer(ModelSerializer):
    class Meta:
        model = LeaseListing
        fields = ['price_per_month', 'deposit_amount', 'lease_term', 'conditions']

class RentListingSerializer(ModelSerializer):
    class Meta:
        model = RentListing
        fields = ['price_per_month', 'rent_term', 'conditions']