<?php

// Disable a plugin based on environment. We don't want to purge cache during local/staging development.
// Also allows for listening to graphcdn_purge event to perform additional invalidation
//

add_action( 'admin_init', 'disable_stellate_plugin' );

// TODO: we want want our staging/dev environments hitting production, so we need to override the service name and token
// $stellate_staging_service_name = "";
// $stellate_staging_token = "";

function disable_stellate_plugin() {
  $plugin_slug = 'stellate/wp-stellate.php';

  if ( !defined( 'WP_STELLATE_ENABLED' )){
    if ( defined( 'WP_HOST' ) && WP_HOST == "production" ) {
      global $stellate_production_enabled;
      if ($stellate_production_enabled){
        define('WP_STELLATE_ENABLED', true);
      }
    }

    if ( defined( 'WP_HOST' ) && WP_HOST == "staging" ) {
      global $stellate_staging_enabled;
      if ($stellate_staging_enabled){
        define('WP_STELLATE_ENABLED', true);
      }
    }

    if ( defined( 'WP_HOST' ) && WP_HOST == "development" ) {
      global $stellate_development_enabled;
      if ($stellate_development_enabled){
        define('WP_STELLATE_ENABLED', true);
      }
    }
  }


  if (defined( 'WP_STELLATE_ENABLED' ) && WP_STELLATE_ENABLED){
    // leave enabled
  } else {
    // disable
    deactivate_plugins( $plugin_slug );
  }
}

// TODO: When purge is called, we can do additional invalidation to the front-end
function stellate_purge_callback( $args ) {
  // error_log('stellate_purge_callback');
  // error_log( print_r( $args, true ) );
}

add_action( 'stellate_purge', 'stellate_purge_callback', 10, 2 );