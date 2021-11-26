<?php
// This rewrites permalinks so they point to your front-end domain, not the headless WP
function bubs_next_preview_link( $link ) {
  global $headless_domain;

  return str_replace( trailingslashit( $headless_domain ), trailingslashit( get_home_url() ), $link );
}

function bubs_next_post_link( $link ) {
    global $headless_domain;

    if (function_exists('is_graphql_request') && is_graphql_request()) {
        return $link;
    } elseif ($headless_domain) {
        return str_replace( trailingslashit( get_home_url() ), trailingslashit( $headless_domain ), $link );
    } else {
        return $link;
    }
}

add_filter( 'page_link', 'bubs_next_post_link' );
add_filter( 'post_link', 'bubs_next_post_link' );
add_filter( 'term_link', 'bubs_next_post_link' );
add_filter( 'post_type_link', 'bubs_next_post_link' );
add_filter( 'preview_post_link', 'bubs_next_preview_link' );
