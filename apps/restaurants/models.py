from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
	name = models.CharField(max_length=50)

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name='Categoria'
		verbose_name_plural = 'Categorias'

class City(models.Model):
	name = models.CharField(max_length=100)

	def __unicode__(self):
		return self.name
	class Meta:
		verbose_name='Ciudad'
		verbose_name_plural = 'Ciudades'

class Payment(models.Model):
	pay = models.CharField(max_length=50)


	def __unicode__(self):
		return self.pay

	class Meta:
		verbose_name='Pago'
		verbose_name_plural = 'Pagos'

class Restaurant(models.Model):
	payment = models.ManyToManyField(Payment)
	category = models.ManyToManyField(Category)
	name = models.CharField(max_length=100)
	description = models.TextField(max_length=300)
	image = models.ImageField(upload_to='fotos')

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name='Restaurantes'
		verbose_name_plural = 'Restaurantes'

class Establishment(models.Model):
	restaurant = models.ForeignKey(Restaurant)
	city = models.ForeignKey(City)
	direccion = models.CharField(max_length=50)

	def __unicode__(self):
		return self.direccion

	class Meta:
		verbose_name='Establecimiento'
		verbose_name_plural='Establecimientos'

class Tip(models.Model):
	restaurant = models.ForeignKey(Restaurant)
	user = models.ForeignKey(User)
	content = models.TextField(max_length=300)
