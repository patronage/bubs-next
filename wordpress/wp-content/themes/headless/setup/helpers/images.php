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
// ACF
//

// custom image sizes (used to provide thumnail sizes for ACF)
// Width only crops
add_image_size( '300 wide', 300, 9999, false );
add_image_size( '600 wide', 600, 9999, false );
add_image_size( '1600 wide', 1600, 9999, false );

// Forced Aspect Ratio width/height cropping
add_image_size( 'Social', 1200, 628, true );
