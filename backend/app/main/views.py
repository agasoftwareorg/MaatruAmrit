from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters as dfilter
from rest_framework.pagination import PageNumberPagination

from django.db.models import Max
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


class CurrentUserViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticatedView]

    @action(detail=False, methods=['get'], name="Current User")
    def user(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], name="Current Hospital")
    def hospital(self, request):
        hospital = request.user.hospital
        serializer = serializers.HospitalSerializer(hospital, context={'request': request})
        return Response(serializer.data)


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
    pagination_class = StandardResultsSetPagination

    @action(detail=False, methods=['get'], name="Max ID")
    def id(self, request):
        max_id = models.Mother.objects.aggregate(Max("id"))["id__max"]
        return Response({
            "id": (max_id or 0) + 1
        })


class DonationViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DonationSerializer
    permission_classes = [permissions.IsUserView]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        mother = self.kwargs['mother']
        return models.Donation.objects.filter(mother=mother)


class ChildViewSet(viewsets.ModelViewSet):
    queryset = models.Child.objects.all()
    serializer_class = serializers.ChildSerializer
    filter_backends = [filters.HospitalFilterBackend]
    permission_classes = [permissions.IsUserView]
    pagination_class = StandardResultsSetPagination

    @action(detail=False, methods=['get'], name="Max ID")
    def id(self, request):
        max_id = models.Child.objects.aggregate(Max("id"))["id__max"]
        return Response({
            "id": (max_id or 0) + 1
        })


class BatchViewSet(viewsets.ModelViewSet):
    queryset = models.Batch.objects.prefetch_related("collections").prefetch_related("dispatches").all()
    serializer_class = serializers.BatchSerializer
    filter_backends = [filters.HospitalFilterBackend, dfilter.OrderingFilter, DjangoFilterBackend]
    permission_classes = [permissions.IsUserView]
    pagination_class = StandardResultsSetPagination
    filterset_fields = ['pasteurization']
    ordering_fields = ['id']

    @action(detail=False, methods=['get'], name="Max ID")
    def id(self, request):
        max_id = models.Batch.objects.aggregate(Max("id"))["id__max"]
        return Response({
            "id": (max_id or 0) + 1
        })

class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CollectionSerializer
    permission_classes = [permissions.IsUserView]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        batch = self.kwargs['batch']
        return models.Collection.objects.select_related("mother").filter(batch=batch)


class DispatchViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DispatchSerializer
    permission_classes = [permissions.IsUserView]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        child = self.kwargs['child']
        return models.Dispatch.objects.select_related("batch").filter(child=child)
