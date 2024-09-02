from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate,login
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

class Register(APIView):
    def post(self,request):
        serializer = RegisterSerializer(data=request.data, many=False)

        if serializer.is_valid():
            user = serializer.save()
            
            return Response({"userId": user.id, 
                             "Message": "User created ."}, 
                             status=status.HTTP_201_CREATED
                             )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            

class Login(APIView):
    def post(self,request):
        data=request.data
        email=data['email']
        password=data['password']
        user=authenticate(email=email,password=password)
        if user is not None:
            
                
                login(request,user)
                token=RefreshToken.for_user(user)
                return Response({'message':'you are successfully logged in',
                                
                                'refresh':str(token),
                                'access':str(token.access_token),
                                'pk':user.pk

                },status=status.HTTP_200_OK)
            
                
        else:
            return Response({
                
                'message':'invalid email or password'
            },status=status.HTTP_400_BAD_REQUEST)