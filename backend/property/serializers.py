from rest_framework.serializers import ModelSerializer,SerializerMethodField,BooleanField
from .models import *
from .utils import generate_docusign_preview_url
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

    is_saved = SerializerMethodField()
    owner_id = SerializerMethodField()

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
            'owner_id',
            'owner_name',
            'owner_email',
            'owner_phone',
            'is_owner',
            'sale_listing_details',
            'lease_listing_details',
            'rent_listing_details',
            'is_saved'
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
    
    def get_is_saved(self,obj):
        return SavedProperties.objects.filter(property_id=obj).exists()
    def get_owner_id(self,obj):
        return obj.owner.user.id if obj.owner else None

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


class CallRequestSerializer(ModelSerializer):

    class Meta:
        model = CallRequest
        fields = ['id', 'requested_by', 'lister', 'property', 'message', 'phone_number','listing_type', 'status','is_completed','created_at']

class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'content', 'notification_type', 'call_request',  'is_read', 'created_at']

class SavedPropertySerializer(ModelSerializer):
    class Meta:
        model = SavedProperties
        fields = '__all__'

class ContractSerializer(ModelSerializer):
    preview_url = SerializerMethodField()
    class Meta:
        model = Contract
        fields = ['id','property', 'buyer_or_renter', 'owner_or_agent', 'status', 'preview_url']

    def get_preview_url(self, obj):

        request = self.context.get('request')
        print(request)
       
        # admin_email = request.user.email  # Get admin email from the request user
        # admin_name = request.user.get_full_name()  # Get admin name

        try:
            # return generate_docusign_preview_url(obj.docu_sign_url, admin_email, admin_name)
            pass
        except Exception as e:
            print(f"Error generating preview URL: {e}")
            return None  # Or you could return an error message, depending on yo

class ExtendedPropertySerializer(PropertySerializer):
    call_requests = SerializerMethodField()  
    contracts = SerializerMethodField()      

    class Meta(PropertySerializer.Meta): 
        fields = PropertySerializer.Meta.fields + [
            'call_requests',
            'contracts',
        ]

    def get_call_requests(self, obj):
        requests = CallRequest.objects.filter(property=obj)
        return CallRequestSerializer(requests, many=True).data

    def get_contracts(self, obj):
        contracts = Contract.objects.filter(property=obj)
        return ContractSerializer(contracts, many=True).data


class DocuSignTemplateSerializer(ModelSerializer):
    is_active = BooleanField(default=True)
    class Meta:
        model = DocuSignTemplate
        fields = '__all__'


    def create(self, validated_data):
        if 'is_active' not in validated_data:
            validated_data['is_active'] = True
        return super().create(validated_data)