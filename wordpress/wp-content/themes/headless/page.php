<?php
/**
 * The template for displaying all pages.
 *
 */

// headless redirect
$slug = str_replace(home_url(), '', get_permalink(get_the_ID()));

if ( is_front_page() && is_home() ) {
    wp_redirect( $headless_domain, 301 );
} else {
    wp_redirect( $headless_domain . $slug, 301 );
}
exit;
