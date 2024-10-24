from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Profile)
admin.site.register(Property)
admin.site.register(LeaseListing)
admin.site.register(SaleListing)
admin.site.register(RentListing)
admin.site.register(CallRequest)
admin.site.register(Notification)
admin.site.register(SavedProperties)
admin.site.register(DocuSignTemplate)
admin.site.register(Contract)