from django.contrib import admin
from .models import Profile,Property,LeaseListing,RentListing,SaleListing
# Register your models here.

admin.site.register(Profile)
admin.site.register(Property)
admin.site.register(LeaseListing)
admin.site.register(SaleListing)
admin.site.register(RentListing)