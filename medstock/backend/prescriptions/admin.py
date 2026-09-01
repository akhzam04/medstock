from django.contrib import admin
from .models import Patient, Prescription, PrescriptionItem

class PrescriptionItemInline(admin.TabularInline):
    model = PrescriptionItem
    extra = 1
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'date_of_birth', 'phone', 'email', 'created_at', 'updated_at')
    search_fields = ('name', 'phone', 'email')
    list_filter = ('created_at', 'updated_at')

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('patient', 'prescription_date', 'prescribing_professional', 'created_at', 'updated_at')
    search_fields = ('patient__name', 'prescribing_professional__username')
    list_filter = ('prescription_date', 'created_at', 'updated_at')
    inlines = [PrescriptionItemInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(PrescriptionItem)
class PrescriptionItemAdmin(admin.ModelAdmin):
    list_display = ('prescription', 'medicine', 'dosage', 'quantity', 'created_at', 'updated_at')
    search_fields = ('medicine__brand_name', 'medicine__generic_name', 'prescription__patient__name')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
