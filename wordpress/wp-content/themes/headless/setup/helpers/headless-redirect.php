<?php

function headless_redirect(){
  global $headless_domain;
  $preview_secret = defined('WORDPRESS_PREVIEW_SECRET') ? WORDPRESS_PREVIEW_SECRET : '';

  $post_type = get_post_type(get_the_ID());
  $slug = str_replace(home_url(), '', get_permalink(get_the_ID()));
  $redirect = '';
  // check if preview and user has edit ability.
  // if so, redirect to preview path

  if ( is_preview() ) {
    if ( current_user_can( 'edit_posts' ) ) {
      $revisions = wp_get_post_revisions(
        get_the_ID(),
        [
          'posts_per_page' => 1,
          'fields'         => 'ids',
          'check_enabled'  => false,
        ]
      );

      $preview_id = is_array( $revisions ) && ! empty( $revisions ) ? array_values( $revisions )[0] : null;

      $redirect = WORDPRESS_PREVIEW_DOMAIN . '/api/preview/?secret=' . $preview_secret . '&id=' . get_the_ID() . '&preview_id=' . $preview_id;
      return $redirect;
    }
  }

  // else do standard redirect tree

  if ($slug) {
    $redirect = WORDPRESS_PREVIEW_DOMAIN . $slug;
  } else {
    $path = $_SERVER['REQUEST_URI'];
    $redirect = WORDPRESS_PREVIEW_DOMAIN . $path;
  }

  return $redirect;
}
