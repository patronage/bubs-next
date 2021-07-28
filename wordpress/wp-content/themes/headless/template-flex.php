<?php

/* Template Name: Flex */

$redirect = headless_redirect();
// echo $redirect;
wp_redirect( $redirect, 307 );
exit;
