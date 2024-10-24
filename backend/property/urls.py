from django.urls import path
from .views import *
from .docusign_views import docusign_webhook

urlpatterns=[

    path('listing_profile/', ListingProfileView.as_view()),
    path('create_listing_profile/', ListingProfileCreateView.as_view()),
    path('listing_profile_details/', ListingProfileDetailView.as_view()),
    path('list_property/',PropertyListingView.as_view()),
     path('<int:pk>/create_sale/', SaleListingView.as_view()),
    path('<int:pk>/create_lease/', LeaseListingView.as_view()),
    path('<int:pk>/create_rent/', RentListingView.as_view()),
    path('property_details/<int:pk>/',PropertyDetailsView.as_view()),

    path('saved_properties/',SavedPropertiesView.as_view()),
    path('owned_properties/',OwnedPropertiesView.as_view()),
    path('properties_in_pipeline/',PipelinePropertiesView.as_view()),

   
    path('properties/', PropertyListView.as_view()),
    path('call_requests/', CallRequestView.as_view()),
    path('notifications/',NotificationView.as_view()),

    path('contract_templates/', ContractTemplates.as_view()),
    path('contracts/', ContractsView.as_view()),

    path('docusign-webhook/', docusign_webhook, name='docusign-webhook')

    
   


    


    
    
]
