from rest_framework.serializers import ModelSerializer
from .models import UserProfile, Addmoney_info

class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class Addmoney_infoSerializers(ModelSerializer):
    class Meta:
        model = Addmoney_info
        fields = '__all__'