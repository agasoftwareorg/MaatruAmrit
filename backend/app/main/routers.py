from rest_framework import routers

from . import views


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'child', views.ChildViewSet, basename='child')
router.register(r'mother', views.MotherViewSet, basename='mother')
router.register(r'mother/(?P<mother>.+)/donation', views.DonationViewSet, basename='donations')
router.register(r'hospital', views.HospitalViewSet, basename='hospital')
router.register(r'batch', views.BatchViewSet, basename='batch')
router.register(r'batch/(?P<batch>.+)/collection', views.CollectionViewSet, basename='collections')
router.register(r'batch/(?P<batch>.+)/dispatch', views.DispatchViewSet, basename='dispatches')
