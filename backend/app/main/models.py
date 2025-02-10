from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class Hospital(models.Model):
    class Subscription(models.TextChoices):
        PLAN_1_YEAR = "PLAN_1_YEAR", _("Plan_1_Year")
        PLAN_2_YEAR = "PLAN_2_YEAR", _("Plan_2_Year")
        PLAN_3_YEAR = "PLAN_3_YEAR", _("Plan_3_Year")
        PLAN_FREE = "PLAN_FREE", _("Plan_Free")
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    branch = models.CharField(max_length=100)
    contact = models.CharField(max_length=100)
    address = models.TextField()
    is_analyzer = models.BooleanField()
    subscription = models.CharField(max_length=50, choices=Subscription)

    def __str__(self):
        return self.name


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
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='children')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Mother(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='mothers')
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


class Batch(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    purity = models.IntegerField(null=True)
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
    created_at = models.DateTimeField(auto_now_add=True)


class Dispatch(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='dispatches')
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
