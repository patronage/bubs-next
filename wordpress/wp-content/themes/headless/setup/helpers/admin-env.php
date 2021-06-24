<?php
//
// When on staging or local, make it clear to use by customizing look, site name.
//

$custom_scheme = '';
$site_prefix = '';

if ( defined('WP_ENV') && WP_ENV == "development" ) {
  // on local
  $custom_scheme = 'ectoplasm';
  $site_prefix = 'LOCAL: ';
} else if (function_exists('is_wpe')){

  // on WPE
  if (strpos($_SERVER['HTTP_HOST'], $staging_wp_host) !== false) {
    $custom_scheme = 'sunrise';
    $site_prefix = 'STAGING: ';
  } else {
    // on production
  }
}

if ($custom_scheme){
  function bubs_update_user_option_admin_color( $color_scheme ) {
    global $custom_scheme;
    $color_scheme = $custom_scheme;
    return $color_scheme;
  }
  add_filter( 'get_user_option_admin_color', 'bubs_update_user_option_admin_color', 5 );
  remove_action( 'admin_color_scheme_picker', 'admin_color_scheme_picker' );
}

if ($site_prefix){
  function bubs_update_title_prefix() {
    global $site_prefix;
    global $site_name;
    update_option( 'blogname', $site_prefix . $site_name );;
  }
  add_action('admin_init', 'bubs_update_title_prefix');
}
?>
