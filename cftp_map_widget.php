<?php


class cftp_map_widget extends WP_Widget {
	public function __construct() {
		$widget_ops = array( 'description' => __('Embed a google map') );
		WP_Widget::__construct( 'cftp_map_widget_', __('Map Widget'), $widget_ops );
	}

	public function widget( $args, $instance ) {
		$options = get_option( 'cftp_gmap_options' );
		wp_enqueue_script( 'google_map_api', 'https://maps.googleapis.com/maps/api/js');//?key='.$options['api_key'] );
		wp_enqueue_script( 'cftp_map_widget', plugin_dir_url( __FILE__ ).'cftp_map_widget.js', array( 'jquery' ) );
		$title = apply_filters( 'widget_title', $instance['title'] );

		$lat = 0;
		if ( isset( $instance[ 'lat' ] ) ) {
			$lat = $instance[ 'lat' ];
		}
		$long = 0;
		if ( isset( $instance[ 'long' ] ) ) {
			$long = $instance[ 'long' ];
		}
		$zoom = 10;
		if ( isset( $instance[ 'zoom' ] ) ) {
			$zoom = $instance[ 'zoom' ];
		}

		$marker = true;
		if ( isset( $instance[ 'marker' ] ) ) {
			$marker = $instance[ 'marker' ];
		} else {
			$marker = false;
		}

		echo $args['before_widget'];
		if ( ! empty( $title ) ) {
			echo $args['before_title'] . $title . $args['after_title'];
		}
		?>
		<style>.cftp_map_widget_container img { max-width:none;} </style>
		<div style="width:100%; height:300px;" class="cftp_map_widget_container" data-lat="<?php echo $lat; ?>" data-long="<?php echo $long; ?>" data-zoom="<?php echo $zoom; ?>" data-marker="<?php echo $marker == true ? 'true' : 'false'; ?>"></div>
		<?php
		echo $args['after_widget'];
	}

	public function form( $instance ) {
		wp_enqueue_script( 'google_map_api', 'https://maps.googleapis.com/maps/api/js');//?key='.$options['api_key'] );
		wp_enqueue_script( 'cftp_map_widget_admin', plugin_dir_url( __FILE__ ).'cftp_map_widget_admin.js', array( 'jquery' ) );
		?>
		<div class="cftp_map_widget_ui unprocessed">
			<?php
			$title = __( 'New title', 'text_domain' );
			if ( isset( $instance[ 'title' ] ) ) {
				$title = $instance[ 'title' ];
			}
			?>
			<p>
				<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>
				<input class="widefat maptitle" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
			</p>
			<?php
			$lat = 0;
			if ( isset( $instance[ 'lat' ] ) ) {
				$lat = $instance[ 'lat' ];
			}
			/*?>
			<p>
				<label for="<?php echo $this->get_field_id( 'lat' ); ?>"><?php _e( 'Latitude:' ); ?></label>
				*/ ?><input class="widefat maplat" id="<?php echo $this->get_field_id( 'lat' ); ?>" name="<?php echo $this->get_field_name( 'lat' ); ?>" type="hidden" value="<?php echo esc_attr( $lat ); ?>" />
			<?php /*</p>
			<?php */
			$long = 0;
			if ( isset( $instance[ 'long' ] ) ) {
				$long = $instance[ 'long' ];
			}
			/*?>
			<p>
				<label for="<?php echo $this->get_field_id( 'long' ); ?>"><?php _e( 'Longitude:' ); ?></label>
				*/ ?><input class="widefat maplong" id="<?php echo $this->get_field_id( 'long' ); ?>" name="<?php echo $this->get_field_name( 'long' ); ?>" type="hidden" value="<?php echo esc_attr( $long ); ?>" />
			<?php /*</p>
			<?php */

			$zoom = 10;
			if ( isset( $instance[ 'zoom' ] ) ) {
				$zoom = $instance[ 'zoom' ];
			}
			/*?>
			<p>
				<label for="<?php echo $this->get_field_id( 'zoom' ); ?>"><?php _e( 'Zoom:' ); ?></label>
				*/ ?><input class="widefat mapzoom" id="<?php echo $this->get_field_id( 'zoom' ); ?>" name="<?php echo $this->get_field_name( 'zoom' ); ?>" type="hidden" value="<?php echo esc_attr( $zoom ); ?>" />
			<?php /*</p>
			<?php */
			$marker = 'on';
			if ( isset( $instance[ 'marker' ] ) ) {
				$marker = $instance[ 'marker' ];
			} else {
				$marker = '';
			}
			?>
			<p>
				<label for="<?php echo $this->get_field_id( 'marker' ); ?>"><?php _e( 'Show Marker:' ); ?></label>
				<input id="<?php echo $this->get_field_id( 'marker' ); ?>" name="<?php echo $this->get_field_name( 'marker' ); ?>" type="checkbox" <?php checked( $marker, 'on' ); ?> />
			</p>

			<style>.cftp_map_widget_container img { max-width:none;} </style>
			<div style=" margin-bottom:1em; width: 400px; height:400px;" class="cftp_map_widget_container"></div>
		</div>
		<?php
	}

	public function update( $new_instance, $old_instance ) {
		$fields = array(
			'title',
			'lat',
			'long',
			'zoom',
			'marker'
		);
		$instance = array();
		foreach ( $fields as $field ) {
			$instance[$field] = $new_instance[$field];
			//( ! empty( $new_instance[$field] ) ) ? strip_tags( $new_instance[$field] ) : '';
		}
		return $instance;
	}
}