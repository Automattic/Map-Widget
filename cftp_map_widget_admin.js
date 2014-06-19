function MapWidgets() {

	this.widgets = [];
}

MapWidgets.prototype.init = function() {
	// kick things off
	jQuery(document.body).bind('click.widgets-toggle', jQuery.proxy( this.initMaps, this ));
	jQuery( document ).ajaxStop( jQuery.proxy( this.initMaps, this ) );
}

MapWidgets.prototype.initMaps = function( array ) {
	var found = jQuery( '#widgets-right .cftp_map_widget_ui.unprocessed');
	var new_widgets = found.map( function( index, domElement ) {
		var m = new MapWidget( domElement );
		return m;
	}).get();
	for ( var i = 0; i < new_widgets.length; i++ ) {
		var m = new_widgets[i];
		this.widgets.push( m );
	}
}

function MapWidget( element ) {
	var e = jQuery( element );
	e.removeClass('unprocessed');
	this.parent = e.parent();
	this.element = element;
	this.zoomInput = this.parent.find('.mapzoom').first();
	this.latInput = this.parent.find('.maplat').first();
	this.longInput = this.parent.find('.maplong').first();
	var mdiv = this.parent.find('.cftp_map_widget_container').first();
	this.mapDiv = mdiv;


	var mlat = this.latInput.val();
	var mlong = this.longInput.val();
	var zoom = this.getZoom();//el.data('zoom');
	var latlng = new google.maps.LatLng( mlat, mlong );
	var mapOptions = {
		center: latlng,
		zoom: Number( zoom ),
		zoomControl: true,
		panControl: false
	};
	this.map = new google.maps.Map( mdiv.get(0), mapOptions );
	var mmarker = true;
	if ( mmarker == true ) {
		var marker = new google.maps.Marker( {
			position: latlng,
			map: this.map
		});
		this.marker = marker;
		google.maps.event.addListener( this.map, 'center_changed', jQuery.proxy( this.center_changed, this ) );
		google.maps.event.addListener( this.map, 'dragend', jQuery.proxy( this.dragend, this ) );
		google.maps.event.addListener( this.map, 'zoom_changed', jQuery.proxy( this.zoom_changed, this ) );
	}
}

MapWidget.prototype.center_changed = function () {

	var center = this.map.getCenter();
	this.latInput.val( center.lat() );
	this.longInput.val( center.lng() );
}

MapWidget.prototype.dragend = function () {
	var center = this.map.getCenter();
	this.marker.setPosition( center )
}

MapWidget.prototype.zoom_changed = function () {
	var zoom = this.map.getZoom();
	this.zoomInput.val( zoom );
}

MapWidget.prototype.getZoom = function () {
	var z = this.zoomInput.val();
	return z;
}


jQuery(document).ready(function() {
	var mw = new MapWidgets();
	mw.init();
	/*var mapOptions = {
	 center: new google.maps.LatLng(-34.397, 150.644),
	 zoom: 8
	 };
	 var map = new google.maps.Map(document.getElementById("map-canvas"),
	 mapOptions);*//*

	jQuery('#widgets-right .cftp_map_widget_container').each( function ( index ) {
		var el = jQuery( this );
		var mlat = 0;//el.data('lat');
		var mlong = 0;//el.data('long');
		var zoom = 6;//el.data('zoom');
		var latlng = new google.maps.LatLng( mlat, mlong );
		var mapOptions = {
			center: latlng,
			zoom: zoom,
			zoomControl: true,
			panControl: false
		};
		var map = new google.maps.Map( this, mapOptions );

		var mmarker = el.data( 'marker' );
		if ( mmarker == true ) {
			var marker = new google.maps.Marker( {
				position: latlng,
				map: map
			});
		}
	});*/
});