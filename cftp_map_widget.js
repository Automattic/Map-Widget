jQuery(document).ready(function() {
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