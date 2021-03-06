<?php
/*
Plugin Name: Map Widget
Description: Google Map Widget
Author: Tom J Nowell, Code For The People, Automattic
Version: 1.1
Author URI: http://codeforthepeople.com/
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

require_once( 'cftp_map_widget.php' );

add_action( 'widgets_init', function() {
	register_widget( 'cftp_map_widget' );
} );