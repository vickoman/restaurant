from django.contrib import admin
from .models import *

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ('name',)

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
	list_display = ('name',)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
	list_display = ('name',)

@admin.register(Payment)		
class PaymentAdmin(admin.ModelAdmin):
	list_display = ('pay',)

@admin.register(Establishment)
class EstablishmentAdmin(admin.ModelAdmin):
	list_display = ('direccion','restaurant',)

@admin.register(Tip)	
class TipAdmin(admin.ModelAdmin):
	list_display = ('content', 'restaurant', 'user',)
 