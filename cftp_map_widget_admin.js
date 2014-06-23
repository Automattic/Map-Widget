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
	var geoInput = e.find('.geocoderinput');
	var geoResults = e.find('.geocoder_results');
	this.geoInput = geoInput;
	this.geoResults = geoResults;

	geoInput.on( 'change', jQuery.proxy( this.geocoder_changed, this ) );
	geoInput.on( 'keypress', jQuery.proxy( this.geocoder_changed, this ) );
}

MapWidget.prototype.geocoder_changed = function () {
	var search = this.geoInput.val();
	var geocoder = new google.maps.Geocoder();
	//search is a string, input by user
	geocoder.geocode({ 'address' : search }, jQuery.proxy( this.geocoder_results, this ) );
}

MapWidget.prototype.geocoder_results = function ( results, status ) {

	var geoResults = this.geoResults;
	geoResults.empty();
	if(status == "ZERO_RESULTS") {
		geoResults.append('<p>None Found</p>');
	} else {
		results = results.slice( 0, 6 );
		results.forEach( jQuery.proxy( this.processGeoCoderResult, this ) );
	}
}

MapWidget.prototype.processGeoCoderResult = function ( result ) {
	var pos = result.geometry.location;
	var el = jQuery( '<a>'+result.formatted_address+'</a>' );
	el.data( 'lat', pos.k );
	el.data( 'long', pos.A );
	el.click( jQuery.proxy( this.onGeoCoderResultClick, this ) );
	this.geoResults.append( el );
}

MapWidget.prototype.onGeoCoderResultClick = function ( event ) {
	var target = event.target || event.srcElement;
	target = jQuery( target );
	var lat = target.data( 'lat' );
	var long = target.data( 'long' );
	var pos = new google.maps.LatLng( lat, long );
	this.setPosition( pos );
}

MapWidget.prototype.setPosition = function ( position ) {
	this.map.panTo( position );
	this.setMarkerPosition( position );
}

MapWidget.prototype.setMarkerPosition = function ( position ) {
	this.marker.setPosition( position );
}

MapWidget.prototype.center_changed = function () {
	var center = this.map.getCenter();
	this.latInput.val( center.lat() );
	this.longInput.val( center.lng() );
}

MapWidget.prototype.dragend = function () {
	var center = this.map.getCenter();
	this.setMarkerPosition( center );
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
});
