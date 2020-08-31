<?php
/**
 * The Template for displaying all single posts
 */

// headless redirect
$slug = str_replace(home_url(), '', get_permalink(get_the_ID()));

wp_redirect( $headless_domain . $slug, 301 );

exit;
