<?php

/* Template Name: Flex */

// WP Engine needs this to support auto WP updates
$user_agent = $_SERVER['HTTP_USER_AGENT'];
if ( strpos($user_agent, 'WPEBot') ) {
  http_response_code(200);
  exit();
}

$redirect = headless_redirect();
// echo $redirect;
wp_redirect( $redirect, 307 );
exit;
