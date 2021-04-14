<?php

function wp_register_taxonomy_issue()
{
    $labels = [
        'name'                  => _x('Issue Areas', 'taxonomy general name'),
        'singular_name'         => _x('Issue Area', 'taxonomy singular name'),
        'search_items'          => __('Search Issue Areas'),
        'all_items'             => __('All Issue Areas'),
        'parent_item'           => __('Parent Issue Area'),
        'parent_item_colon'     => __('Parent Issue Area:'),
        'edit_item'             => __('Edit Issue Area'),
        'update_item'           => __('Update Issue Area'),
        'add_new_item'          => __('Add New Issue Area'),
        'new_item_name'         => __('New Issue Area Name'),
        'menu_name'             => __('Issue Area'),
    ];
    $args = [
        'hierarchical'          => false,
        'labels'                => $labels,
        'show_ui'               => true,
        'show_in_quick_edit'    => false,
        'meta_box_cb'           => false,
        'show_admin_column'     => true,
        'query_var'             => true,
        'rewrite'               => ['slug' => 'issue'],
        'show_in_graphql'       => true,
        'graphql_single_name'   => 'issue_area',
        'graphql_plural_name'   => 'issue_areas',
    ];
    register_taxonomy('issue', ['press', 'post'], $args);
}
add_action('init', 'wp_register_taxonomy_issue');
