import hashlib

from PIL import Image
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError


def hospital_logo(instance, filename):
    return "hospital/logos/{0}".format(filename)

def validate_image_dimensions(image):
    img = Image.open(image)
    max_width = 800
    max_height = 600
    if img.width > max_width or img.height > max_height:
        raise ValidationError(f'Image size should not exceed {max_width}x{max_height}px.')


class Hospital(models.Model):
    class Subscription(models.TextChoices):
        PLAN_1_YEAR = "PLAN_1_YEAR", _("Plan_1_Year")
        PLAN_2_YEAR = "PLAN_2_YEAR", _("Plan_2_Year")
        PLAN_3_YEAR = "PLAN_3_YEAR", _("Plan_3_Year")
        PLAN_FREE = "PLAN_FREE", _("Plan_Free")
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    branch = models.CharField(max_length=100, null=True, blank=True)
    contact = models.CharField(max_length=50, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    is_analyzer = models.BooleanField(default=False)
    subscription = models.CharField(max_length=50, choices=Subscription)
    subscription_end = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    logo = models.ImageField(null=True, upload_to=hospital_logo, max_length=500, validators=[])

    def __str__(self):
        return self.name

    def milk_ready_to_use(self):
        milk_ready_to_use = 0
        for batch in self.batches.all():
            if batch.pasteurization == Batch.PasteurizationResult.NEGATIVE:
                milk_ready_to_use += batch.available_quantity()
        return milk_ready_to_use

    def milk_awaiting_results(self):
        milk_awaiting_results = 0
        for batch in self.batches.all():
            if batch.pasteurization == Batch.PasteurizationResult.NO_RESULT:
                milk_awaiting_results += batch.available_quantity()
        return milk_awaiting_results


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", _("Admin")
        HOSPITAL_ADMIN = "HOSPITAL_ADMIN", _("Hospital_Admin")
        HOSPITAL_USER = "HOSPITAL_USER", _("Hospital_User")

    role = models.CharField(max_length=50, choices=Role)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='users', null=True)
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["role"]

    def __str__(self):
        return self.username

    def is_admin(self):
        return self.role == self.Role.ADMIN


class Child(models.Model):
    id = models.AutoField(primary_key=True)
    reg_number = models.CharField(max_length=200, unique=True)
    reg_date = models.DateTimeField()
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    sex = models.CharField(max_length=10)
    mother_name = models.CharField(max_length=100, null=True, blank=True)
    ward = models.CharField(max_length=100, null=True, blank=True)
    birth_weight = models.IntegerField(null=True)
    current_weight = models.IntegerField(null=True)
    diagnose = models.TextField(null=True, blank=True)
    doctor_name = models.CharField(max_length=100, null=True, blank=True)
    doctor_contact = models.CharField(max_length=50, null=True, blank=True)
    doctor_designation = models.CharField(max_length=100, null=True, blank=True)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='children')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


def screening_report_loc(instance, filename):
    hashh = hashlib.sha256(str(instance.hospital.id).encode()).hexdigest()
    return "hospital/{0}/reports/mother_screening/{1}".format(hashh, filename)


class Mother(models.Model):
    id = models.AutoField(primary_key=True)
    reg_number = models.CharField(max_length=200, unique=True)
    reg_date = models.DateTimeField()
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    height = models.IntegerField(null=True)
    weight = models.IntegerField(null=True)
    education = models.CharField(max_length=100, null=True, blank=True)
    blood_group = models.CharField(max_length=20, null=True, blank=True)
    relative_name = models.CharField(max_length=100, null=True, blank=True)
    relative_type = models.CharField(max_length=100, null=True, blank=True)
    relative_contact = models.CharField(max_length=50, null=True, blank=True)
    relative_email = models.CharField(max_length=200, null=True, blank=True)
    relative_address = models.TextField(null=True, blank=True)
    delivery_date = models.DateTimeField(null=True)
    delivery_mode = models.CharField(max_length=100, null=True, blank=True)
    medical_issues = models.TextField(null=True, blank=True)
    surgical_issues = models.TextField(null=True, blank=True)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='mothers')
    screening_report = models.FileField(null=True, upload_to=screening_report_loc, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def available_quantity(self):
        available_quantity = 0
        for collection in self.donations.all():
            available_quantity += collection.quantity

        for dispatch in self.collections.all():
            available_quantity -= dispatch.quantity
        return available_quantity


class Donation(models.Model):
    mother = models.ForeignKey(Mother, on_delete=models.CASCADE, related_name='donations')
    quantity = models.IntegerField()
    donated_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)


def pasteurization_report_loc(instance, filename):
    hashh = hashlib.sha256(str(instance.hospital.id).encode()).hexdigest()
    return "hospital/{0}/reports/pasteurization/{1}".format(hashh, filename)

def analyzer_report_loc(instance, filename):
    hashh = hashlib.sha256(str(instance.hospital.id).encode()).hexdigest()
    return "hospital/{0}/reports/analyzer/{1}".format(hashh, filename)

class Batch(models.Model):
    class PasteurizationResult(models.TextChoices):
        POSITIVE = "POSITIVE", _("Positive")
        NEGATIVE = "NEGATIVE", _("Negative")
        NO_RESULT = "NO_RESULT", _("No_Result")
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    fat = models.IntegerField(null=True)
    protein = models.IntegerField(null=True)
    snf = models.IntegerField(null=True)
    sol = models.IntegerField(null=True)
    den = models.IntegerField(null=True)
    lactose = models.IntegerField(null=True)
    temp = models.IntegerField(null=True)
    fp = models.IntegerField(null=True)
    calories = models.IntegerField(null=True)
    pasteurization = models.CharField(
        max_length=50, default=PasteurizationResult.NO_RESULT.value, choices=PasteurizationResult
    )
    pasteurization_report = models.FileField(null=True, upload_to=pasteurization_report_loc, max_length=500)
    analyzer_report = models.FileField(null=True, upload_to=analyzer_report_loc, max_length=500)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='batches')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('name', 'hospital',)

    def available_quantity(self):
        available_quantity = 0
        for collection in self.collections.all():
            available_quantity += collection.quantity

        for dispatch in self.dispatches.all():
            available_quantity -= dispatch.quantity
        return available_quantity


class Collection(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='collections')
    mother = models.ForeignKey(Mother, on_delete=models.CASCADE, related_name='collections')
    quantity = models.IntegerField()
    collected_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)


class Dispatch(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='dispatches')
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    dispatched_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
