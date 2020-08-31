<?php

function cdn_upload_url($args)
{
    $args['baseurl'] = 'https://res.cloudinary.com/bubsnext/image/upload/bubsnext';
    return $args;
}

if (defined('WP_ENV')) {
    if (WP_ENV != 'development') {
        add_filter('upload_dir', 'cdn_upload_url');
    }
} else {
    add_filter('upload_dir', 'cdn_upload_url');
}
