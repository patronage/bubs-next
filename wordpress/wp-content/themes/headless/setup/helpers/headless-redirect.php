<?php


function build_preview_link() {
  global $headless_domain;

  $auth_code = wpe_headless_generate_authentication_code(
    wp_get_current_user()
  );

  return $headless_domain . '/api/preview/?code=' . rawurlencode($auth_code);
}

function headless_redirect(){
  global $headless_domain;

  $post_type = get_post_type(get_the_ID());
  $slug = ltrim(str_replace(home_url(), '', get_permalink(get_the_ID())), '/');
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

      $auth_code = wpe_headless_generate_authentication_code(
        wp_get_current_user()
      );

      $preview_id = is_array( $revisions ) && ! empty( $revisions ) ? array_values( $revisions )[0] : null;

      $redirect = $headless_domain . '/api/preview/?code=' . rawurlencode($auth_code) . '&id=' . get_the_ID() . '&preview_id=' . $preview_id;
      return $redirect;
    }
  }

  // else do standard redirect tree

  if ($slug) {
    if ( current_user_can( 'edit_posts' ) ) {
      $auth_code = wpe_headless_generate_authentication_code(
        wp_get_current_user()
      );
      $redirect = $headless_domain . '/api/preview/?code=' . rawurlencode($auth_code) . '&slug=' . $slug . '&id=' . get_the_ID();
    } else {
      $redirect = $headless_domain . $slug;
    }
  } else {
    $path = $_SERVER['REQUEST_URI'];
    if ( current_user_can( 'edit_posts' ) ) {
      $auth_code = wpe_headless_generate_authentication_code(
        wp_get_current_user()
      );
      $redirect = $headless_domain . '/api/preview/?code=' . rawurlencode($auth_code) . '&path=' . $path . '&id=' . get_the_ID();
    } else {
      $redirect = $headless_domain . $path;
    }
  }

  return $redirect;
}
