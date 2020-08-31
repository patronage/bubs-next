<?php
/**
 * The template for displaying 404 pages (Not Found)
*/

// headless redirect
$slug = $_SERVER['REQUEST_URI'];
wp_redirect( $headless_domain . $slug, 301 );
exit;
