from rest_framework.permissions import BasePermission

from .logger import log


class IsAuthenticatedView(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated


class IsAdminView(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin()


class IsUserView(BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated or request.user.is_admin():
            return False
        if request.user.role == 'HOSPITAL_USER':
            return request.method in ["GET", "OPTIONS", "POST"]
        return True
