from django.urls import path
from .views import *
urlpatterns = [
    path('users/',UserList.as_view()),
    path('properties/',PropertyList.as_view()),
    path('analytics/',AnalyticsView.as_view()),

]
