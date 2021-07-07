<?php

// Make composer installed php libraries available
// require_once(get_theme_root() . "/../plugins/composer-libs/autoload.php");

//
// Define variables
// Workarounds for not having env support on WP Engine
//

$site_name = 'Bubs Next';
$production_wp_host = 'bubsnext.wpengine.com';
$production_next_domain = 'https://bubsnext.patronage.org/';
$staging_wp_host = 'bubsnextstage.wpengine.com';
$staging_next_domain = 'https://bubsnext-git-staging-patronage.vercel.app/';


// Headless var
if (defined('WP_HEADLESS_DOMAIN')) {
    $headless_domain = WP_HEADLESS_DOMAIN;
} else {
    $headless_domain = $production_next_domain;
}

//
// Load WP Config files
//

// Theme Options
function bubs_theme_options($wp_customize)
{
    $wp_customize->remove_section('custom_css');
}

add_action('customize_register', 'bubs_theme_options');


// Post Types
//include_once 'setup/post-types/your-custom-type.php';


// Taxonomies
//include_once 'setup/taxonomies/your-custom-taxonmy.php';


//
// WP Helper Functions
//

// Admin
include_once 'setup/helpers/acf-options.php';
include_once 'setup/helpers/admin.php';
include_once 'setup/helpers/admin-env.php';
// include_once 'setup/helpers/excerpt.php';
include_once 'setup/helpers/images.php';
include_once 'setup/helpers/menus.php';
include_once 'setup/helpers/wysiwyg.php';

// Graphql
include_once 'setup/helpers/wpgraphql.php';

// Security Settings
include_once 'setup/helpers/google-login-cookies.php';
// include_once 'setup/helpers/google-login-force.php';
// include_once 'setup/helpers/password-rotation-wpe.php';
include_once 'setup/helpers/xmlrpc-disable.php';

// Wordpress Theme Support Config
// REMOVAL OF THESE = POTIENTAL LOSS OF DATA

add_theme_support('post-thumbnails');
add_theme_support('menus');
