<?php

class cftp_map_widget_settings {
	private static $instance = null;

	public static function getInstance() {
		if ( self::$instance == null ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	function __construct() {
		add_action( 'admin_menu', array( $this, 'admin_add_page' ) );
		add_action( 'admin_init', array( $this, 'admin_init' ) );
	}

	function init() {
		//
	}


	function options_page() {
		?>
		<div class="wrap">
			<h2>Google Maps Widget</h2>
			<form action="options.php" method="post">
				<?php settings_fields( 'cftp_gmap_options' ); ?>
				<?php do_settings_sections( 'cftp_gmap_options' ); ?>

				<input name="Submit" type="submit" class="button button-primary" value="<?php esc_attr_e( 'Save Changes' ); ?>" />
			</form>
		</div>
		<?php
	}

	function admin_add_page() {
		add_options_page( 'Map Widget', 'Map Widget', 'manage_options', 'cftp_gmap_options', array( $this, 'options_page' ) );
	}


	function admin_init() {

		register_setting( 'cftp_gmap_options', 'cftp_gmap_options', array( $this, 'options_validate' ) );
		add_settings_section( 'api_keys', 'API', array( $this, 'plugin_section_text' ), 'cftp_gmap_options' );
		add_settings_field( 'api_key', 'Google Maps API Key', array( $this, 'plugin_setting_string' ), 'cftp_gmap_options', 'api_keys' );
	}

	function plugin_section_text() {
		?>
		<p>API keys can be gotten from Google via <a href="https://code.google.com/apis/console/?noredirect">https://code.google.com/apis/console/?noredirect</a></p><?php
		//echo '<p>Main description of this section here.</p>';
	}

	function plugin_setting_string() {
		$options = get_option( 'cftp_gmap_options' );
		echo '<input id="api_key" name="cftp_gmap_options[api_key]" value="'.$options['api_key'].'" class="regular-text" type="text">';
	}

	function options_validate( $input ) {
		return $input;
	}

} 