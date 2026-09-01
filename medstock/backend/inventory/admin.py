from django.contrib import admin
from .models import Category, Supplier, Medicine, StockMovement

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('created_at', 'updated_at')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_person', 'email', 'phone', 'created_at', 'updated_at')
    search_fields = ('name', 'contact_person', 'email', 'phone')
    list_filter = ('created_at', 'updated_at')

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('brand_name', 'generic_name', 'category', 'unit', 'price', 'stock_quantity', 'reorder_level', 'supplier', 'expiry_date', 'batch_number')
    search_fields = ('brand_name', 'generic_name', 'batch_number')
    list_filter = ('category', 'supplier', 'unit', 'expiry_date')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('medicine', 'movement_type', 'quantity', 'reference_number', 'user', 'created_at')
    search_fields = ('reference_number', 'medicine__brand_name', 'medicine__generic_name')
    list_filter = ('movement_type', 'created_at', 'user')
    readonly_fields = ('created_at', 'updated_at')
