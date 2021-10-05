<?php

//
// Default Thumbnail Size
//

// We want to use a social friendly ratio for preview
// This image is also used as the SEO default
// If you need a different size image for a post, add it as an option below
// And add it via an ACF image field

set_post_thumbnail_size( 300, 157, true );

//
// Image Resizing
//

// custom image sizes (used to provide thumnail sizes for ACF)
// Width only crops
add_image_size( '300 wide', 300, 9999, false );
add_image_size( '600 wide', 600, 9999, false );
add_image_size( '1600 wide', 1600, 9999, false );

// Forced Aspect Ratio width/height cropping
// Be careful relying on these, WordPress won't enlarge (zoom)
// if an uploaded dimension is smaller than the target.
add_image_size( 'Social', 1200, 628, true );
add_image_size( 'Square', 1200, 1200, true );

//
// Don't wrap images attached to WYSIWYG's with links
//

function bubs_imagelink_setup() {
    $image_set = get_option( 'image_default_link_type' );

    if ($image_set !== 'none') {
        update_option('image_default_link_type', 'none');
    }
}
add_action('admin_init', 'bubs_imagelink_setup', 10);
