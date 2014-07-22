<?php
/*
Plugin Name: Map Widget
Description: CFTP Google Map Widget
Author: Tom J Nowell, Code For The People
Version: 1.0
Author URI: http://codeforthepeople.com/
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

//require_once( 'cftp_map_widget_settings.php' );
require_once( 'cftp_map_widget.php' );

//cftp_map_widget_settings::getInstance();

add_action( 'widgets_init', function() {
	register_widget( 'cftp_map_widget' );
} );