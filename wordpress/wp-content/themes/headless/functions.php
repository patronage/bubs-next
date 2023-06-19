<?php

// Make composer installed php libraries available
// require_once(get_theme_root() . "/../plugins/composer-libs/autoload.php");

//
// Load WP Config files
//

// Customize these variables per site
$staging_wp_host = 'bubsnexts.wpengine.com';
$dashboard_cleanup = false; // Optionally will hide all but our custom widget
$docs_link = ''; // set to a path if you have a site/document for editor instructions

// webhook config
$headless_webhooks_password_protected = true;
$headless_webhooks_graphcdn_purge_api = 'http://host.docker.internal:3000/api/graphcdn/'; // Docker to host computer endpoint
$headless_webhooks_acf_options = ['acf-options-theme-settings'];
$headless_webhooks_post_types = ['page', 'post'];
$headless_webhooks_redirects_redirection = true;
$headless_webhooks_redirects_yoast = false;

// Determine the hosting environment we're in
if (defined('WP_ENV') && WP_ENV == 'development') {
    define('WP_HOST', 'localhost');
    $headless_domain = $local_domain || 'http://localhost:3000';
} else {
    $headless_domain = rtrim(get_theme_mod('headless_preview_url'), '/');

    if (strpos($_SERVER['HTTP_HOST'], $staging_wp_host) !== false) {
        define('WP_HOST', 'staging');
    } else {
        define('WP_HOST', 'production');
    }
}

// Theme Options
function bubs_theme_options($wp_customize) {
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
include_once 'setup/helpers/images.php';
include_once 'setup/helpers/menus.php';

// Only load permalinks rewriting file if not on a sitemap
$uri = $_SERVER['REQUEST_URI'];
if (strpos($uri, 'sitemap.xml') == false) {
    include_once 'setup/helpers/permalinks.php';
}

include_once 'setup/helpers/role-super-editor.php';
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
