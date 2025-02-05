from rest_framework.permissions import BasePermission

from .logger import log


class IsAdminView(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin()


class IsUserView(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and not request.user.is_admin()
