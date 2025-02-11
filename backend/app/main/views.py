from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from . import models
from . import filters
from . import serializers
from . import permissions


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.exclude(role=models.User.Role.ADMIN).all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAdminView]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'hospital']
    pagination_class = StandardResultsSetPagination


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = models.Hospital.objects.all()
    serializer_class = serializers.HospitalSerializer
    permission_classes = [permissions.IsAdminView]
    pagination_class = StandardResultsSetPagination


class MotherViewSet(viewsets.ModelViewSet):
    queryset = models.Mother.objects.prefetch_related("collections").prefetch_related("donations").all()
    serializer_class = serializers.MotherSerializer
    filter_backends = [filters.HospitalFilterBackend]
    permission_classes = [permissions.IsUserView]


class DonationViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DonationSerializer
    permission_classes = [permissions.IsUserView]

    def get_queryset(self):
        mother = self.kwargs['mother']
        return models.Donation.objects.filter(mother=mother)


class ChildViewSet(viewsets.ModelViewSet):
    queryset = models.Child.objects.all()
    serializer_class = serializers.ChildSerializer
    filter_backends = [filters.HospitalFilterBackend]
    permission_classes = [permissions.IsUserView]


class BatchViewSet(viewsets.ModelViewSet):
    queryset = models.Batch.objects.prefetch_related("collections").prefetch_related("dispatches").all()
    serializer_class = serializers.BatchSerializer
    filter_backends = [filters.HospitalFilterBackend]
    permission_classes = [permissions.IsUserView]


class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CollectionSerializer
    permission_classes = [permissions.IsUserView]

    def get_queryset(self):
        batch = self.kwargs['batch']
        return models.Collection.objects.filter(batch=batch)


class DispatchViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DispatchSerializer
    permission_classes = [permissions.IsUserView]

    def get_queryset(self):
        batch = self.kwargs['batch']
        return models.Dispatch.objects.filter(batch=batch)
