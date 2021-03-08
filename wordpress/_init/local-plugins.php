<?php
/*
Plugin Name: Disable plugins when doing local dev
Description: If the WP_LOCAL_DEV constant is true, disables plugins that you specify
Version: 0.1
License: GPL version 2 or any later version
Author: Mark Jaquith
Author URI: http://coveredwebservices.com/
*/

class Disable_Plugins_When_Local_Dev {
    static $instance;
    private $disabled = array();

    /**
     * Sets up the options filter, and optionally handles an array of plugins to disable
     * @param array $disables Optional array of plugin filenames to disable
     */
    public function __construct( Array $disables = NULL) {
        // Handle what was passed in
        if ( is_array( $disables ) ) {
            foreach ( $disables as $disable )
                $this->disable( $disable );
        }

        // Add the filter
        add_filter( 'option_active_plugins', array( $this, 'do_disabling' ) );

        // Allow other plugins to access this instance
        self::$instance = $this;
    }

    /**
     * Adds a filename to the list of plugins to disable
     */
    public function disable( $file ) {
        $this->disabled[] = $file;
    }

    /**
     * Hooks in to the option_active_plugins filter and does the disabling
     * @param array $plugins WP-provided list of plugin filenames
     * @return array The filtered array of plugin filenames
     */
    public function do_disabling( $plugins ) {
        if ( count( $this->disabled ) ) {
            foreach ( (array) $this->disabled as $plugin ) {
                $key = array_search( $plugin, $plugins );
                if ( false !== $key )
                    unset( $plugins[$key] );
            }
        }
        return $plugins;
    }
}

// Custom script to do the inverse

function run_activate_plugin( $plugin ) {
    $current = get_option( 'active_plugins' );
    $plugin = plugin_basename( trim( $plugin ) );

    if ( !in_array( $plugin, (array)$current ) ) {
        $current[] = $plugin;
        sort( $current );
        do_action( 'activate_plugin', trim( $plugin ) );
        update_option( 'active_plugins', $current );
        do_action( 'activate_' . trim( $plugin ) );
        do_action( 'activated_plugin', trim( $plugin) );
    }

    return null;
}


/* Begin customization */

if ( defined( 'WP_ENV' ) && WP_ENV == "development" ) {

    // set local dev ENV vars
    define( 'GRAPHQL_DEBUG', true );

    // disable
    new Disable_Plugins_When_Local_Dev( array(
        'hello.php',
        'object-cache.php',
        'absolute-privacy/absolute_privacy.php',
        'google_apps_login/google_apps_login.php'
    ));

    // enable
    // run_activate_plugin('debug-bar/debug-bar.php' );
    // run_activate_plugin('query-monitor/query-monitor.php' );
    // run_activate_plugin('transients-manager/transients-manager.php' );
    // run_activate_plugin('user-switching/user-switching.php' );
    // run_activate_plugin('object-cache.php' );

}
