<?php

function expose_acf_to_graphql_only($result, $rule, $screen, $field_group)
{
    if (!is_graphql_http_request()) {
        return $result;
    }

    $page_template_acf_groups = [
        'content_area',
        'component_intro',
        'on_the_issues',
        'action_bar',
        'sign_up',
        'about'
    ];
    if (in_array($field_group['graphql_field_name'], $page_template_acf_groups) && $screen['post_type'] === 'page') {
        return true;
    }

    return $result;
}
add_filter('acf/location/rule_match', 'expose_acf_to_graphql_only', 10, 4);
