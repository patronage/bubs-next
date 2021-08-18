<?php

// Make composer installed php libraries available
// require_once(get_theme_root() . "/../plugins/composer-libs/autoload.php");

//
// Load WP Config files
//

$preview_domain = '';
$staging_wp_host = 'bubsnexts.wpengine.com';

// Determine the hosting environment we're in
if ( defined('WP_ENV') && WP_ENV == "development" ) {
  define('WP_HOST', 'localhost');
  $preview_domain = 'http://localhost:3000';
} else if ( function_exists('is_wpe') ) {
  if ( strpos($_SERVER['HTTP_HOST'], $staging_wp_host) !== false ) {
    define('WP_HOST', 'staging');
    $preview_domain = 'https://bubs-next-git-preview-mode-patronage.vercel.app';
  } else {
    define('WP_HOST', 'production');
    $preview_domain = 'https://bubs-next.vercel.app';
  }
}

define('WORDPRESS_PREVIEW_DOMAIN', $preview_domain);

// Theme Options
function bubs_theme_options($wp_customize)
{
    // include_once 'setup/theme-options/footer.php';
    // include_once 'setup/theme-options/integrations.php';
    // include_once 'setup/theme-options/social.php';
    $wp_customize->remove_section('custom_css');
}

add_action('customize_register', 'bubs_theme_options');


// Post Types
//include_once 'setup/post-types/events.php';
//include_once 'setup/post-types/heroes.php';
//include_once 'setup/post-types/members.php';


// Taxonomies
//include_once 'setup/taxonomies/issue-areas.php';


// WP Helper Functions
include_once 'setup/helpers/acf-options.php';

include_once 'setup/helpers/admin.php';
include_once 'setup/helpers/admin-env.php';
//include_once 'setup/helpers/cloudinary.php';
include_once 'setup/helpers/webhooks.php';
include_once 'setup/helpers/menus.php';
include_once 'setup/helpers/wpgraphql.php';
include_once 'setup/helpers/wysiwyg.php';

include_once 'setup/helpers/headless-redirect.php';

// Security Settings
// include_once 'setup/helpers/google-login-force.php';
// include_once 'setup/helpers/password-rotation-wpe.php';
include_once 'setup/helpers/xmlrpc-disable.php';

// Wordpress Theme Support Config
// REMOVAL OF THESE = POTIENTAL LOSS OF DATA

add_theme_support('post-thumbnails');
add_theme_support('menus');

