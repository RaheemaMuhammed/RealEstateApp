from django.db import models
from authentication.models import CustomUser
# Create your models here.


class Profile(models.Model):
    USER_TYPE_CHOICES = [
        ('owner', 'Owner'),
        ('agent', 'Agent'),
    ]
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=5, choices=USER_TYPE_CHOICES)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    is_verified = models.BooleanField(default=False)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.user_type}"
    
class Property(models.Model):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    description = models.TextField()
    property_type = models.CharField(max_length=20, choices=[('residential', 'Residential'), ('commercial', 'Commercial')])
    address = models.TextField()
    area = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True) 
    number_of_rooms = models.IntegerField(blank=True, null=True) 
    number_of_bathrooms = models.IntegerField(blank=True, null=True)
    parking_space = models.BooleanField(default=False)
    furnished = models.BooleanField(default=False)
    built_at=models.DateField(null=True,blank=True)
    image = models.ImageField(upload_to='property_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description

class SaleListing(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='sale_listings')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    conditions = models.TextField(blank=True, null=True)  
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.property.description} - For Sale"

class LeaseListing(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='lease_listings')
    price_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount=models.DecimalField(max_digits=10, decimal_places=2)
    lease_term = models.CharField(max_length=50)  
    conditions = models.TextField(blank=True, null=True)  
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.property.description} - For Lease"
    
class RentListing(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='rent_listings')
    price_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    rent_term = models.CharField(max_length=50)  
    conditions = models.TextField(blank=True, null=True)  
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.property.description} - For Rent"

class CallRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='call_requests')  
    lister = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_call_requests') 
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='call_requests')  
    listing_type = models.CharField(max_length=10, choices=[('buy', 'Buy'), ('rent', 'Rent'), ('lease', 'Lease')], default='buy')

    message = models.TextField(blank=True, null=True)  
    phone_number = models.CharField(max_length=15)  
    is_completed = models.BooleanField(default=False)  
    created_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')


    def __str__(self):
        return f"Call request from {self.requested_by} to {self.lister} for {self.property}"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('call_request', 'Call Request'),
        ('contract_uploaded', 'Contract Uploaded'),
        ('contract_approved', 'Contract Approved'),
        ('contract_rejected', 'Contract Rejected'),
        ('contract_signing', 'Contract Signing Required'),
        
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications') 
    content = models.CharField(max_length=255)  
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES) 
    is_read = models.BooleanField(default=False)  
    call_request = models.ForeignKey(CallRequest, on_delete=models.CASCADE, null=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user} - {self.notification_type}"

class SavedProperties(models.Model):
    user_id=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    property_id=models.ForeignKey(Property,on_delete=models.CASCADE)
    listing_type = models.CharField(max_length=10, choices=[('buy', 'Buy'), ('rent', 'Rent'), ('lease', 'Lease')], default='buy')



class DocuSignTemplate(models.Model):
    template_name = models.CharField(max_length=100)
    template_id = models.CharField(max_length=100) 
    listing_type = models.CharField(
        max_length=10,
        choices=[('buy', 'Buy'), ('rent', 'Rent'), ('lease', 'Lease')]
    )
    description = models.TextField(blank=True, null=True)  

    def __str__(self):
        return f"{self.template_name} ({self.listing_type})"

class Contract(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    LISTING_TYPE_CHOICES = [
        ('buy', 'Buy'),
        ('lease', 'Lease'),
        ('rent', 'Rent'),
    ]
    
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPE_CHOICES)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='contracts')
    buyer_or_renter = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='contracts')
    owner_or_agent = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='contracts')

    template = models.ForeignKey(DocuSignTemplate, on_delete=models.CASCADE)  
    docu_sign_url = models.URLField(blank=True, null=True)  
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)  
    is_signed_by_owner = models.BooleanField(default=False)
    is_signed_by_buyer = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Contract for {self.property.description} ({self.status})"

