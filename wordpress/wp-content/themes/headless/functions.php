<?php

// Make composer installed php libraries available
// require_once(get_theme_root() . "/../plugins/composer-libs/autoload.php");

//
// Load WP Config files
//

// Headless var
if (defined('WP_HEADLESS_DOMAIN')) {
    $headless_domain = WP_HEADLESS_DOMAIN;
} else {
    $headless_domain = "https://bubsnext.patronage.org/";
}

// Theme Options
function bubs_theme_options($wp_customize)
{
    include_once 'setup/theme-options/footer.php';
    include_once 'setup/theme-options/integrations.php';
    include_once 'setup/theme-options/social.php';
    $wp_customize->remove_section('custom_css');
}

add_action('customize_register', 'bubs_theme_options');


// Post Types
include_once 'setup/post-types/events.php';
include_once 'setup/post-types/heroes.php';
include_once 'setup/post-types/members.php';


// Taxonomies
include_once 'setup/taxonomies/issue-areas.php';


// WP Helper Functions
include_once 'setup/helpers/acf-options.php';
include_once 'setup/helpers/admin.php';
//include_once 'setup/helpers/cloudinary.php';
include_once 'setup/helpers/menus.php';
include_once 'setup/helpers/wpgraphql.php';

// Wordpress Theme Support Config
// REMOVAL OF THESE = POTIENTAL LOSS OF DATA

add_theme_support('post-formats');
add_theme_support('post-thumbnails');
add_theme_support('menus');


// Enable Roots Soil

add_theme_support('soil-clean-up');
add_theme_support('soil-relative-urls');
add_theme_support('soil-disable-trackbacks');
add_theme_support('soil-nice-search');
