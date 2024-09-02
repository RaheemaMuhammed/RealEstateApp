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


