import logging
from rest_framework import filters


class HospitalFilterBackend(filters.BaseFilterBackend):
    """
    Filter that only allows users to see their own objects.
    """
    def filter_queryset(self, request, queryset, view):
        logging.debug(request.user)
        return queryset.filter(hospital=request.user.hospital)
