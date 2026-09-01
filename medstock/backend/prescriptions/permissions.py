from rest_framework import permissions

class IsDoctor(permissions.BasePermission):
    """
    Custom permission to only allow doctors to create prescriptions
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD or OPTIONS requests to all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Only allow doctors to create prescriptions
        return request.user.role == 'doctor' 