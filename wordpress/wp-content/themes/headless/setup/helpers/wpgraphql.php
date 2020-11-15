<?php
// enable graphql debug in local dev
if (defined('WP_ENV')) {
    if ( WP_ENV == 'development'){
        define('GRAPHQL_DEBUG', true);
    }
}

// enable graphql secret key for draft page preview

// if a public repo, uncomment the next line, and 
// copy this filter and save in wpgraphql-jwt.php
// include_once 'wpgraphql-jwt.php';

// if a private repo, uncomment and set here
// add_filter( 'graphql_jwt_auth_secret_key', function() {
//     return 'changeme';
// });

