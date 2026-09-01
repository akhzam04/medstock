from rest_framework import serializers
from .models import Category, Supplier, Medicine, StockMovement

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    supplier_name = serializers.ReadOnlyField(source='supplier.name')

    class Meta:
        model = Medicine
        fields = '__all__'

class StockMovementSerializer(serializers.ModelSerializer):
    medicine_name = serializers.ReadOnlyField(source='medicine.brand_name')
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = StockMovement
        fields = '__all__' 