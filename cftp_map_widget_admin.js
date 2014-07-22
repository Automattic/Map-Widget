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
	this.shown = false;
	var e = jQuery( element );
	e.removeClass('unprocessed');
	var titleel = e.parent().parent().parent().parent().children( '.widget-top' ).first();
	this.parent = e.parent();
	this.element = element;
	this.jqelement = e;
	this.zoomInput = this.jqelement.find('.mapzoom').first();
	this.latInput = this.jqelement.find('.maplat').first();
	this.longInput = this.jqelement.find('.maplong').first();
	var mdiv = this.jqelement.find('.cftp_map_widget_container').first();
	this.mapDiv = mdiv;

	if ( this.mapDiv.is(':visible') ) {
		this.setupMap();
	}
	var geoInput = e.find('.geocoderinput');
	var geoResults = e.find('.geocoder_results');
	this.geoInput = geoInput;
	this.geoResults = geoResults;

	this.idle = true;

	geoInput.on( 'change', jQuery.proxy( this.geocoder_changed, this ) );
	geoInput.on( 'keyup', jQuery.proxy( this.geocoder_changed, this ) );

	titleel.on( 'click', jQuery.proxy( this.setupMap, this ) );
}

MapWidget.prototype.setupMap = function ( ) {

	setTimeout( jQuery.proxy( function() {
		if ( this.shown == true ) {
			this.resizeMap();
			return;
		}
		this.idle = false;
		this.shown = true;
		var mlat = this.latInput.val();
		var mlong = this.longInput.val();
		var zoom = this.getZoom();
		var latlng = new google.maps.LatLng( mlat, mlong );
		var mapOptions = {
			center: latlng,
			zoom: Number( zoom ),
			disableDefaultUI: true,
			zoomControl: true,
			panControl: false
		};
		this.map = new google.maps.Map( this.mapDiv.get(0), mapOptions );
		var mmarker = true;
		if ( mmarker == true ) {
			var marker = new google.maps.Marker( {
				position: latlng,
				map: this.map
			});
			this.marker = marker;
			google.maps.event.addListener( this.map, 'center_changed', jQuery.proxy( this.center_changed, this ) );
			google.maps.event.addListener( this.map, 'idle', jQuery.proxy( function () {
				this.idle = true;
			}, this ) );
			google.maps.event.addListener( this.map, 'dragend', jQuery.proxy( this.dragend, this ) );
			google.maps.event.addListener( this.map, 'zoom_changed', jQuery.proxy( this.zoom_changed, this ) );
		}

	}, this ), 400 );

}


MapWidget.prototype.resizeMap = function ( event ) {
	google.maps.event.trigger( this.map, 'resize' );
	this.map.setZoom( this.map.getZoom() );
}

MapWidget.prototype.geocoder_changed = function ( event ) {
	var search = this.geoInput.val();
	var geocoder = new google.maps.Geocoder();

	//search is a string, input by user
	geocoder.geocode({
		'address' : search
	}, jQuery.proxy( function( results, status ) {
		var search2 = this.geoInput.val();
		if ( search2 == search ) {
			var func = jQuery.proxy( this.geocoder_results, this );
			func( results, status );
		} else {
			//console.log( search2 + ' != ' + search );
		}
	}, this ) );
}

MapWidget.prototype.geocoder_results = function ( results, status ) {
	var geoResults = this.geoResults;
	geoResults.empty();
	if ( ( status == "ZERO_RESULTS" ) || ( results == null ) ) {
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
	if ( this.idle == false ) {
		return;
	}
	var target = event.target || event.srcElement;
	target = jQuery( target );
	var lat = target.data( 'lat' );
	var long = target.data( 'long' );

	this.setPosition( lat, long );
}

MapWidget.prototype.setPosition = function ( lat, long ) {
	this.idle = false;
	var position = new google.maps.LatLng( lat, long );
	this.marker.setMap( null );
	this.setMarkerPosition( position );
	this.map.panTo( position );
	this.marker.setMap( this.map );
	this.resizeMap();
}

MapWidget.prototype.setMarkerPosition = function ( position ) {
	this.marker.setPosition( position );
}

MapWidget.prototype.center_changed = function () {
	if ( this.idle == false ) {
		return;
	}
	var center = this.map.getCenter();
	this.latInput.val( center.lat() );
	this.longInput.val( center.lng() );
}

MapWidget.prototype.dragend = function () {
	if ( this.idle == false ) {
		return;
	}
	var center = this.map.getCenter();
	this.setMarkerPosition( center );
}

MapWidget.prototype.zoom_changed = function () {
	if ( this.idle == false ) {
		return;
	}
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
