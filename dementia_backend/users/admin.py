from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Patient, Recording


# Custom User Admin
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'slmc_id', 'user_type', 'is_staff')
    search_fields = ('username', 'email', 'slmc_id')
    ordering = ('username',)
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'first_name', 'last_name', 'slmc_id', 'user_type')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'slmc_id', 'user_type', 'password1', 'password2')}
        ),
    )

admin.site.register(CustomUser, CustomUserAdmin)


# Recording Inline (appears inside Patient)
class RecordingInline(admin.TabularInline):   # or use StackedInline for bigger forms
    model = Recording
    extra = 0   # no empty rows
    fields = ('recording_file', 'duration', 'created_at')
    readonly_fields = ('created_at',)


# Patient Admin with Recordings inline
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'age', 'gender', 'address', 'emergency_contact')
    search_fields = ('user__first_name', 'user__last_name', 'user__username')
    list_filter = ('gender', 'age')
    ordering = ('user__last_name',)
    inlines = [RecordingInline]   # <-- add recordings under each patient

admin.site.register(Patient, PatientAdmin)


# (Optional) Keep a separate Recording section too
@admin.register(Recording)
class RecordingAdmin(admin.ModelAdmin):
    list_display = ('patient', 'recording_file', 'duration', 'created_at')
    search_fields = ('patient__user__username', 'patient__user__first_name', 'patient__user__last_name')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
