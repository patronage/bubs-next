<?php

function build_preview_link() {
    global $headless_domain;

    $auth_code = wpe_headless_generate_authentication_code(wp_get_current_user());

    return $headless_domain . '/api/preview/?code=' . rawurlencode($auth_code);
}

function headless_redirect() {
    global $headless_domain;

    // don't use get_the_id(), as that will return the first post id
    // https://developer.wordpress.org/reference/functions/get_the_id/#comment-3767
    $id = get_queried_object_id();
    $url = get_permalink($id);
    $slug = parse_url($url, PHP_URL_PATH);
    $path = $_SERVER['REQUEST_URI'];
    $redirect = '';

    // if a 404 quickly fail and send to headless domain to handle
    // if we don't, WP will return info on a post we don't want (e.g. the most recent post)
    if (is_404()) {
        $redirect = $headless_domain . $path;
        return $redirect;
    }

    // check if preview and user has edit ability.
    // if so, redirect to preview path
    if (is_preview()) {
        if (current_user_can('edit_posts')) {
            $auth_code = wpe_headless_generate_authentication_code(wp_get_current_user());

            $redirect = $headless_domain . '/api/preview/?code=' . rawurlencode($auth_code) . '&id=' . $id;

            return $redirect;
        }
    }

    // else do standard redirect tree
    if ($slug) {
        $redirect = $headless_domain . $slug;
    } else {
        $path = $_SERVER['REQUEST_URI'];
        $redirect = $headless_domain . $path;
    }

    return $redirect;
}