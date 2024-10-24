from rest_framework.permissions import BasePermission

class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated





class IsStaff(BasePermission):
    """
    Allows access only to staff (admin or staff users).
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_staff
    
class IsAgent(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.user_type == 'agent'

class IsOwner(BasePermission):
    def has_permission(self, request, view):
        user=request.user
        return hasattr(request.user, 'profile') and user.profile.user_type == 'owner'