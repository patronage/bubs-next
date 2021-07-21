<?php
//
// When on staging or local, make it clear to use by customizing look, site name.
//

$custom_scheme = '';
$site_prefix = '';
$preview_domain = '';
$staging_wp_host = 'bubsnexts.wpengine.com';

if ( defined('WP_ENV') && WP_ENV == "development" ) {
  // on Local
  $custom_scheme = 'ectoplasm';
  $site_prefix = 'LOCAL: ';
  $preview_domain = 'http://localhost:3000';
} else if ( function_exists('is_wpe') ) {

  // on WPE
  if ( strpos($_SERVER['HTTP_HOST'], $staging_wp_host) !== false ) {
    // On Staging
    $custom_scheme = 'sunrise';
    $site_prefix = 'STAGING: ';
    $preview_domain = 'https://bubs-next-git-preview-mode-patronage.vercel.app';
  } else {
    // on Production
    $preview_domain = 'https://bubsnext.vercelapp.com';
  }
}

define('WORDPRESS_PREVIEW_DOMAIN', $preview_domain);

if ( $custom_scheme ) {
  function bubs_update_user_option_admin_color( $color_scheme ) {
    global $custom_scheme;
    $color_scheme = $custom_scheme;
    return $color_scheme;
  }

  add_filter( 'get_user_option_admin_color', 'bubs_update_user_option_admin_color', 5 );
  remove_action( 'admin_color_scheme_picker', 'admin_color_scheme_picker' );
}

if ( $site_prefix ) {
  function bubs_update_title_prefix() {
    global $site_prefix;
    global $site_name;

    update_option( 'blogname', $site_prefix . $site_name );;
  }

  add_action('admin_init', 'bubs_update_title_prefix');
}
?>
