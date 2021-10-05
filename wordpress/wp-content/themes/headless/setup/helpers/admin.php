<?php

//
// WP Admin Customization
//

// Go away "Comments" (SpamPots)
function remove_comments_link() {
    remove_menu_page( 'edit-comments.php' );
}

function remove_comment_support() {
    remove_post_type_support( 'post', 'comments' );
    remove_post_type_support( 'page', 'comments' );
}

function remove_comments_admin() {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('comments');
}

// Show pages list in DESC order by edit date, not alphabetical
function set_post_order_in_admin( $wp_query ) {
    global $pagenow;
    if ( is_admin() && 'edit.php' == $pagenow && !isset($_GET['orderby'])) {
        $wp_query->set( 'orderby', 'modified' );
        $wp_query->set( 'order', 'DSC' );
    }
}
add_filter('pre_get_posts', 'set_post_order_in_admin' );

//
// Yoast
//

// Don't show WP SEO stuff in post list
add_filter( 'wpseo_use_page_analysis', '__return_false' );


// Lower WP SEO Priority so it's at the bottom of single posts:
function lower_wpseo_priority() {
    return 'low';
}
add_filter( 'wpseo_metabox_prio', 'lower_wpseo_priority' );

//
// ACF
//

// Hide ACF in production to ensure version controlled JSON is truth
// http://awesomeacf.com/snippets/hide-the-acf-admin-menu-item-on-selected-sites/
function awesome_acf_hide_acf_admin() {

    // check if the current env is dev
    if ( defined('WP_ENV') && WP_ENV == "development" ) {
        // show the acf menu item
        return true;
    } else {
        // hide the acf menu item
        return false;
    }
}
add_filter('acf/settings/show_admin', 'awesome_acf_hide_acf_admin');

?>
