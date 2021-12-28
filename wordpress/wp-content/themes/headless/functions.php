<?php

// Make composer installed php libraries available
// require_once(get_theme_root() . "/../plugins/composer-libs/autoload.php");

//
// Load WP Config files
//

$site_name = '';
$headless_domain = ''; // leave blank;
$production_headless_domain = 'https://bubs-next.vercel.app';
$staging_wp_host = 'bubsnexts.wpengine.com';
$staging_headless_domain = 'https://bubs-next-git-staging-patronage.vercel.app';
$local_domain = 'http://localhost:3000';
$docs_link = ''; // set to a path if you have a site/document for editor instructions

// Determine the hosting environment we're in
if ( defined('WP_ENV') && WP_ENV == "development" ) {
  define('WP_HOST', 'localhost');
  $headless_domain = $local_domain;
} else if ( function_exists('is_wpe') ) {
  if ( strpos($_SERVER['HTTP_HOST'], $staging_wp_host) !== false ) {
    define('WP_HOST', 'staging');
    $preview_domain = get_theme_mod('headless_preview_url');

    if ($preview_domain) {
      $headless_domain = rtrim($preview_domain, '/');
    } else {
      $headless_domain = $staging_headless_domain;
    }
  } else {
    define('WP_HOST', 'production');
    $headless_domain = $production_headless_domain;
  }
}

// Theme Options
function bubs_theme_options($wp_customize)
{
    include_once 'setup/theme-options/headless.php';
    $wp_customize->remove_section('custom_css');
}

add_action('customize_register', 'bubs_theme_options');


// Post Types
//include_once 'setup/post-types/press.php';


// Taxonomies
//include_once 'setup/taxonomies/issue-areas.php';


// WP Helper Functions

include_once 'setup/helpers/acf-options.php';
include_once 'setup/helpers/admin.php';
include_once 'setup/helpers/admin-env.php';
include_once 'setup/helpers/auth.php';
include_once 'setup/helpers/dashboard-preview.php';
include_once 'setup/helpers/headless-redirect.php';
include_once 'setup/helpers/menus.php';
include_once 'setup/helpers/permalinks.php';
include_once 'setup/helpers/webhooks.php';
include_once 'setup/helpers/wpgraphql.php';
include_once 'setup/helpers/wysiwyg.php';

// Security Settings
// include_once 'setup/helpers/google-login-force.php';
// include_once 'setup/helpers/password-rotation-wpe.php';
include_once 'setup/helpers/google-login-cookies.php';
include_once 'setup/helpers/xmlrpc-disable.php';

// Wordpress Theme Support Config
// REMOVAL OF THESE = POTIENTAL LOSS OF DATA

add_theme_support('post-thumbnails');
add_theme_support('menus');

