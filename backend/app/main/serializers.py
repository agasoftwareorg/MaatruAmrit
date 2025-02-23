import logging
log = logging.getLogger(__name__)
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from . import models


class CurrentHospitalDefault:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context['request'].user.hospital

    def __repr__(self):
        return '%s()' % self.__class__.__name__


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = models.User
        fields = ['id', 'username', 'password', 'role', 'hospital']

    def validate(self, data):
        """
        Check that start is before finish.
        """
        if data['role'] == models.User.Role.ADMIN:
            raise serializers.ValidationError("Admin role is not allowed")

        if data['hospital'] is None:
            raise serializers.ValidationError("Hospital is required for this role")
        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Hash password
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Hash password
        return super().update(instance, validated_data)


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Hospital
        fields = '__all__'


class MotherSerializer(serializers.ModelSerializer):
    hospital = serializers.HiddenField(default=CurrentHospitalDefault())
    available_quantity = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.Mother
        fields = '__all__'

    def get_available_quantity(self, obj):
        return obj.available_quantity()


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Donation
        fields = '__all__'


class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Child
        fields = '__all__'

    hospital = serializers.HiddenField(default=CurrentHospitalDefault())


class CollectionSerializer(serializers.ModelSerializer):
    mother_reg_number = serializers.CharField(source='mother.reg_number', read_only=True)

    class Meta:
        model = models.Collection
        fields = '__all__'

    def validate(self, attrs):
        if attrs['quantity'] > attrs['mother'].available_quantity():
            raise serializers.ValidationError("Quantity exceeds available quantity from mother")
        return attrs


class BatchSerializer(serializers.ModelSerializer):
    # collections = CollectionSerializer(many=True, write_only=True)
    available_quantity = serializers.SerializerMethodField(read_only=True)
    hospital = serializers.HiddenField(default=CurrentHospitalDefault())

    class Meta:
        model = models.Batch
        fields = '__all__'

    def get_available_quantity(self, obj):
        return obj.available_quantity()

    # def create(self, validated_data):
    #     collections_data = validated_data.pop('collections')
    #     batch = models.Batch.objects.create(**validated_data)
    #
    #     # Create Student records linked to this classroom
    #     for collection in collections_data:
    #         models.Collection.objects.create(batch=batch, **collection)
    #
    #     return batch
    #
    # def update(self, instance, validated_data):
    #     collections_data = validated_data.pop('collections', [])
    #
    #     batch = super().update(instance, validated_data)
    #
    #     existing_mothers = list(batch.collections.values_list('mother', flat=True))
    #
    #     new_collection_ids = []
    #     for collection_data in collections_data:
    #         mother = collection_data.get('mother', None)
    #
    #         if mother in existing_mothers:  # Update existing student
    #             collection = models.Collection.objects.get(id=mother, batch=batch)
    #             collection.ml_collected = collection_data.get('ml_collected')
    #             collection.save()
    #             new_collection_ids.append(mother)
    #         else:  # Create new student
    #             collection = models.Collection.objects.create(batch=batch, **collection_data)
    #             new_collection_ids.append(collection.id)
    #
    #     # Remove students that were not in the request
    #     collections_to_remove = set(existing_mothers) - set(new_collection_ids)
    #     models.Collection.objects.filter(mother__in=collections_to_remove).delete()
    #
    #     return instance

class DispatchSerializer(serializers.ModelSerializer):
    batch_number = serializers.CharField(source='batch.name', read_only=True)

    class Meta:
        model = models.Dispatch
        fields = '__all__'

    def validate(self, attrs):
        if attrs['quantity'] > attrs['batch'].available_quantity():
            raise serializers.ValidationError("Quantity exceeds available quantity from batch")
        return attrs
