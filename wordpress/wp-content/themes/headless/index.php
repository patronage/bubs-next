<?php
/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 */

$user_agent = $_SERVER['HTTP_USER_AGENT'];

if ( strpos($user_agent, 'WPEBot') ) {
  http_response_code(200);
} else {
  $redirect = headless_redirect();
  // echo $redirect;
  wp_redirect( $redirect, 307 );
}
