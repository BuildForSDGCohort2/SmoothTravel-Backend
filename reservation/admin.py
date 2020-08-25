"""
Admin config for smoothtravel project.

For more information on this file, see
https://docs.djangoproject.com/
"""
from .models import Flight, Hotel
from django.contrib import admin

# Register your models here.
admin.site.register(Flight)
admin.site.register(Hotel)