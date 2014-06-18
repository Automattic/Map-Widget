jQuery(document).ready(function() {
	/*var mapOptions = {
		center: new google.maps.LatLng(-34.397, 150.644),
		zoom: 8
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);*/

	jQuery('.cftp_map_widget_container').each( function ( index ) {
		var el = jQuery( this );
		var mlat = el.data('lat');
		var mlong = el.data('long');
		var zoom = el.data('zoom');
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
	});
});