var app = app || {};

app.mainView = Backbone.View.extend({
	el: '#app',

	events: {
		'keyup #buscador': 'buscarRestaurant'
	},

	initialize: function(){
		app.restaurantsCollection.on('add', this.agregarRestaurantFiltro);
		app.restaurantsCollection.fetch();
		this.llegofinal();
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