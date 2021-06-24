<?php
/* -----------------------------------------
 * Put excerpt meta-box before editor
 * ----------------------------------------- */
function my_add_excerpt_meta_box( $post_type ) {
    if ( in_array( $post_type, array( 'post', 'page' ) ) ) {
         add_meta_box(
            'postexcerpt', __( 'Excerpt' ), 'post_excerpt_meta_box', $post_type, 'test', // change to something other then normal, advanced or side
            'high'
        );
    }
}
add_action( 'add_meta_boxes', 'my_add_excerpt_meta_box' );

function my_run_excerpt_meta_box() {
    # Get the globals:
    global $post, $wp_meta_boxes;

    # Output the "advanced" meta boxes:
    do_meta_boxes( get_current_screen(), 'test', $post );

}

add_action( 'edit_form_after_title', 'my_run_excerpt_meta_box' );

function my_remove_normal_excerpt() { /*this added on my own*/
    remove_meta_box( 'postexcerpt' , 'post' , 'normal' );
}
add_action( 'admin_menu' , 'my_remove_normal_excerpt' );

//
// Show excerpt to all users
//

/* always show excerpt .. hide display options */
add_action('admin_head', 'myplugin_modify_admin_header');
function myplugin_modify_admin_header() {
  ?>
  <style type='text/css'>
    #postexcerpt { display: block !important; }
    label[for=postexcerpt-hide] { display: none !important; }
  </style>
  <?php
}

?>
