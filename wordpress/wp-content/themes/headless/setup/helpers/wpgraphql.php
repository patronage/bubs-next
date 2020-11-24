<?php
//
// enable graphql debug in local dev
//
if (defined('WP_ENV')) {
    if ( WP_ENV == 'development'){
        define('GRAPHQL_DEBUG', true);
    }
}

//
// enable graphql secret key for draft page preview
//

// docs: https://github.com/wp-graphql/wp-graphql-jwt-authentication#install-activate--setup
// salt generator: https://api.wordpress.org/secret-key/1.1/salt/
//

// if a public repo, uncomment the next line, and 
// copy this filter and save in wpgraphql-jwt.php
// include_once 'wpgraphql-jwt.php';

// if a private repo, uncomment and set here
// add_filter( 'graphql_jwt_auth_secret_key', function() {
//     return 'changeme';
// });

//
// Add ACF to Page Templates
//

// Workaround until this is fixed in a future version:
// https://github.com/wp-graphql/wp-graphql-acf/issues/76

function expose_acf_to_graphql_only($result, $rule, $screen, $field_group)
{
    if (!is_graphql_http_request()) {
        return $result;
    }

    // this is the value of mandatory graphql
    $page_template_acf_groups = [
        'acfFlex',
    ];
    if (in_array($field_group['graphql_field_name'], $page_template_acf_groups) && $screen['post_type'] === 'page') {
        return true;
    }

    return $result;
}
add_filter('acf/location/rule_match', 'expose_acf_to_graphql_only', 10, 4);
