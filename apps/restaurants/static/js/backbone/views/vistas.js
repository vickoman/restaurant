var app = app || {};

app.mainView = Backbone.View.extend({
	el: '#app',

	events: {
		'keyup #buscador': 'buscarRestaurant',
		'click #ciudad a': 'selectCiudad',
		'click .categoria': 'selectCategoria',
		'click .pago': 'selectPago'
	},

	initialize: function(){
		app.restaurantsCollection.on('add', this.agregarRestaurantFiltro);
		app.restaurantsCollection.fetch();
		this.llegofinal();
	},

	selectCiudad: function(ev){	
		ev.preventDefault();
		this.$('.list-group').html('');
		window.stade = true;
		window.ciudad = $(ev.target).attr('id');		
		app.restaurantCiudad = Backbone.Model.extend({
			urlRoot: 'api/ciudades/' + window.ciudad + '/restaurants/'
		});
		var restaurantsCiudades = Backbone.Collection.extend({
			model: app.restaurantCiudad,
			url: '/api/ciudades/' + window.ciudad + '/restaurants/'
		});
		app.restaurantsCiudadesCollection = new restaurantsCiudades(); 	
		
		if(window.categoria>0 && window.pago > 0)
		{
			this.filtroCategoriaCiudadPago();
		}else if(window.categoria>0 && window.pago <= 0)
		{
			this.filtroCategoriaCiudad();
		}else if(window.categoria<=0 && window.pago>0)
		{
			this.filtroCategoriaCiudadPago();
		}else if(window.categoria<=0 && window.pago<=0)
		{
			this.filtroCiudad();
		}
		
	},

	

	selectCategoria: function(ev){
		if($(ev.target).is(':checked')){				
			this.$('.list-group').html('');
			window.stade = true;
			window.categoria = $(ev.target).attr('id');			
			app.restaurantCategoria = Backbone.Model.extend({
				urlRoot: 'api/categorias/' + window.categoria + '/restaurants/'
			});
			var restaurantsCategorias = Backbone.Collection.extend({
				model: app.restaurantCategoria,
				url: '/api/categorias/' + window.categoria + '/restaurants/'
			});
			app.restaurantsCategoriasCollection = new restaurantsCategorias(); 	
			if(window.categoria == 0 ){
				if(window.ciudad>0 && window.pago>0){
					this.filtroCategoriaCiudadPago();
				}else if(window.ciudad > 0  && window.pago <= 0){
					this.filtroCiudad();
				}else if(window.pago>0 && window.ciudad<1){
					this.filtroPayment();
				}else if(window.pago<0 && window.ciudad<1){
					app.restaurantsCollection.each(this.agregarRestaurant, this);
				}
			}else{
				if(window.ciudad>0 && window.pago>0)
				{
					this.filtroCategoriaCiudadPago();					
				}else if(window.ciudad>0 && window.pago<=0){
					this.filtroCategoriaCiudad();
				}else if(window.pago>0 && window.ciudad>1){
					this.filtroCategoriaPago();
				}else if(window.pago<0 && window.ciudad <1){
					this.filtroCategoria();
				}
			}
		}else{
			window.stade = false;			
		}		
	},

	selectPago: function(ev)
	{
		if($(ev.target).is(':checked')){				
			this.$('.list-group').html('');
			window.stade = true;
			window.pago = $(ev.target).attr('id');			
			app.restaurantPayment = Backbone.Model.extend({
				urlRoot: 'api/payments/' + window.pago + '/restaurants/'
			});
			var restaurantsPayments = Backbone.Collection.extend({
				model: app.restaurantPayment,
				url: '/api/payments/' + window.pago + '/restaurants/'
			});
			app.restaurantsPaymentsCollection = new restaurantsPayments(); 	
			if (window.pago == 0) {
				if(window.ciudad>0 && window.categoria>0){
					this.filtroCategoriaCiudad();
				}else if(window.ciudad > 0 && window.categoria <= 0){
					this.filtroCiudad();
				}else if(window.ciudad<1 && window.categoria>0){
					this.filtroCategoria();
				}else if(window.ciudad <1 && window.categoria < 0){
					app.restaurantsCollection.each(this.agregarRestaurant, this);
				}
			} else{
				if (window.ciudad >0 && window.categoria>0) {
					this.filtroCategoriaCiudadPago();
				}else if(window.ciudad <0 && window.categoria<=0){
					this.filtroCategoriaCiudadPago();					
				}else if(window.categoria>0 && window.ciudad<1){
					this.filtroCategoriaPago();
				}else if(window.categoria<0 && window.ciudad<1){
					this.filtroPayment();
				}
			};
		}else{
			window.stade = false;			
		}		
	},

	filtroCiudad: function()
	{
		var self = this;
		app.restaurantsCiudadesCollection.fetch({success: function(ciudades){
			ciudades.each(self.agregarRestaurant, self);
		}});
	},

	filtroCategoriaCiudad: function()
	{
		var self = this;
		app.restaurantsCategoriasCollection.fetch({success: function(categorias){
			categorias.each(function(categoria){
				app.restaurantsCiudadesCollection.fetch({success:function(ciudades){
					ciudades.each(function(ciudad){
						if(categoria.get('id') == ciudad.get('id')){
							self.agregarRestaurant(categoria);
						}
					});
				}})
			});
		}});
	},

	filtroCategoriaPago: function()
	{
		var self = this;
		app.restaurantsCategoriasCollection.fetch({success: function(categorias){
			categorias.each(function(categoria){
				app.restaurantsPaymentsCollection.fetch({success: function(pagos){
					pagos.each(function(pago){
						if(categoria.get('id') == pago.get('id')){
							self.agregarRestaurant(categoria);
						}
					});
				}});
			});
		}});
	},

	filtroCategoriaCiudadPago: function()
	{
		var self = this;
		app.restaurantsCategoriasCollection.fetch({success: function(categorias){
			categorias.each(function(categoria){
				app.restaurantsCiudadesCollection.fetch({success: function(ciudades){
					ciudades.each(function(ciudad){
						app.restaurantsPaymentsCollection.fetch({success: function(pagos){
							pagos.each(function(pago){
								if(pago.get('id') == categoria.get('id') && categoria.get('id') == ciudad.get('id') && ciudad.get('id') == pago.get('id')){
									self.agregarRestaurant(categoria);
								}
							});
						}});
					});
				}});
			});
		}});
	},

	filtroCategoria: function(){
		var self = this;
		app.restaurantsCategoriasCollection.fetch({success: function(categories){
			categories.each(self.agregarRestaurant, self);
		}});
	},

	filtroPayment: function()
	{
		var self = this;
		app.restaurantsPaymentsCollection.fetch({success: function(payments){
			payments.each(self.agregarRestaurant, self);
		}});
	},

	agregarRestaurant: function(modelo){
		var vista = new app.restaurantView({ model: modelo });
		$('.list-group').append(vista.render().$el);
	},

	agregarRestaurantFiltro: function(modelo){
		if((window.cantidad >= modelo.get('id')) && (window.cantidad - 5 < modelo.get('id'))){
			var vista = new app.restaurantView({model: modelo});
			$('.list-group').append(vista.render().$el);
		}
	},

	buscarRestaurant: function(){
		window.stade = true;
		var cadBuscador = $('#buscador').val().toLowerCase();
		var filtro = app.restaurantsCollection.filter(function(modelo){
			var cadModelo = modelo.get('name').substring(0, cadBuscador.length).toLowerCase();
			if((cadBuscador === cadModelo) && (cadModelo.length == cadBuscador.length) && (cadBuscador.length != 0 ) && (cadModelo.length != 0 ))
			{
				return modelo;
			}else if(cadModelo.length == 0 && cadBuscador.length == 0 ){
				window.stade = false;
				return modelo;
			}
		});
		this.agregarFiltro(filtro);
	},

	agregarFiltro: function(coleccionFiltro){
		this.$('.list-group').html('');
		// if(window.stade === false){
		// 	coleccionFiltro = coleccionFiltro.filter(function(){
		// 		if(window.cantidad >= modelo.get('id'))
		// 		{
		// 			return modelo;
		// 		}
		// 	});
		// }
		coleccionFiltro.forEach(this.agregarRestaurant, this);
	},

	llegofinal: function() {
		var self = this;
		$(window).scroll(function(){
			if($(window).height() + $(window).scrollTop() == $(document).height()){				
				if(window.stade === false){
					window.cantidad = window.cantidad + 5;
					app.restaurantsCollection.each(self.agregarRestaurantFiltro);
				}
			}
		});
	}	

});
app.restaurantView = Backbone.View.extend({
	template: _.template($('#tplRestaurant').html()),

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});