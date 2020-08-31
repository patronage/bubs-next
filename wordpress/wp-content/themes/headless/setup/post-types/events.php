<?php
// Register Custom Post Type
function cpt_event()
{
    $labels = array(
        'name'                  => _x('Events', 'Post Type General Name', 'text_domain'),
        'singular_name'         => _x('Event', 'Post Type Singular Name', 'text_domain'),
        'menu_name'             => __('Events', 'text_domain'),
        'name_admin_bar'        => __('Events', 'text_domain'),
        'archives'              => __('Item Archives', 'text_domain'),
        'parent_item_colon'     => __('Parent Item:', 'text_domain'),
        'all_items'             => __('All Items', 'text_domain'),
        'add_new_item'          => __('Add New Item', 'text_domain'),
        'add_new'               => __('Add New', 'text_domain'),
        'new_item'              => __('New Item', 'text_domain'),
        'edit_item'             => __('Edit Item', 'text_domain'),
        'update_item'           => __('Update Item', 'text_domain'),
        'view_item'             => __('View Item', 'text_domain'),
        'search_items'          => __('Search Item', 'text_domain'),
        'not_found'             => __('Not found', 'text_domain'),
        'not_found_in_trash'    => __('Not found in Trash', 'text_domain'),
        'featured_image'        => __('Featured Image', 'text_domain'),
        'set_featured_image'    => __('Set featured image', 'text_domain'),
        'remove_featured_image' => __('Remove featured image', 'text_domain'),
        'use_featured_image'    => __('Use as featured image', 'text_domain'),
        'insert_into_item'      => __('Insert into item', 'text_domain'),
        'uploaded_to_this_item' => __('Uploaded to this item', 'text_domain'),
        'items_list'            => __('Items list', 'text_domain'),
        'items_list_navigation' => __('Items list navigation', 'text_domain'),
        'filter_items_list'     => __('Filter items list', 'text_domain'),
    );

    $rewrite = array(
        'slug'                => 'events',
        'with_front'          => false,
        'pages'               => true,
        'feeds'               => true,
    );

    $args = array(
        'label'                 => __('Events', 'text_domain'),
        'description'           => __('Events', 'text_domain'),
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'excerpt',  'thumbnail', 'revisions'),
        'taxonomies'            => array(''),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-dashboard',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => false,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'rewrite'               => $rewrite,
        'capability_type'       => 'page',
        'show_in_graphql'       => true,
        'graphql_single_name' => 'event',
        'graphql_plural_name' => 'events',
    );

    register_post_type('event', $args);
}

add_action('init', 'cpt_event', 0);

add_filter('manage_event_posts_columns', 'set_custom_edit_event_columns');
function set_custom_edit_event_columns($columns)
{
    $columns['minute'] = __('Minute', 'text_domain');
    return $columns;
}

// Add the data to the custom columns for the book post type:
add_action('manage_event_posts_custom_column', 'custom_event_column', 10, 2);
function custom_event_column($column, $post_id)
{
    switch ($column) {

        case 'minute':
            echo get_post_meta($post_id, 'minute_position', true);
            break;
    }
}

add_filter('manage_edit-event_sortable_columns', 'make_sortable');
function make_sortable($columns)
{
    $columns['minute'] = 'minute';
    return $columns;
}
