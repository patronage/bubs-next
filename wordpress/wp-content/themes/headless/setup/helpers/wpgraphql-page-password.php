<?php

$restricted_fields = [];
$bad_password = false;

/****
 * We need to allow these headers in the request to graphql so we can
 * check the password that we set in header "x-wp-post-password" and
 * bypass graphcdn with the "x-preview-token" header"
 ****/
add_filter('graphql_access_control_allow_headers', function ($headers) {
  return array_merge($headers, ['x-wp-post-password', 'x-preview-token']);
});

/****
 * We check if the password is set in the request headers as well as the post's visibility
 * being 'restricted' (password protected) and that the data type is a PostObject.
 * We check the submitted password against the post's password and if it matches, we
 * set the visibility to public. If the password does not match we set the global variable
 * $bad_password to true, which is used to send the bad_password field back in
 * graphql_request_results.
 ****/
add_filter(
  'graphql_object_visibility',
  function ($visibility, $model_name, $data) {
    if (
      $visibility === 'restricted' &&
      $model_name === 'PostObject' &&
      isset($_SERVER['HTTP_X_WP_POST_PASSWORD'])
    ) {
      $client_password = $_SERVER['HTTP_X_WP_POST_PASSWORD'];

      if ($client_password === $data->post_password) {
        $visibility = 'public';
      } else {
        global $bad_password;
        $bad_password = true;
      }
    }

    return $visibility;
  },
  10,
  3,
);

/****
 * If the post visibility is set to 'restricted' we get the restricted fields that Wordpress
 * allows to be displayed and set those to a global variable $restricted_fields for use in
 * graphql_request_results.
 ****/
add_filter(
  'graphql_allowed_fields_on_restricted_type',
  function ($fields, $model_name, $data, $visibility, $owner, $current_user) {
    if ($model_name === 'PostObject') {
      if ($visibility === 'restricted') {
        global $restricted_fields;
        $restricted_fields = $fields;
      } else {
        global $restricted_fields;
        $restricted_fields = [];
      }
    }

    return $fields;
  },
  10,
  6,
);

/****
 * If restricted fields is an empty array (which we set as default
 * at the top of this file) then we immediately return the $reponse
 * and don't touch the data. If restricted fields is not empty, we
 * check if the $response contains data['contentNode'] and if so, we
 * loop through the fields and remove any that are not in the $restricted_fields.
 * We also set seo fields so the page will have noindex and nofollow and we set the
 * $bad_password field so if a bad password was entered we can display an error.
 ****/
add_filter(
  'graphql_request_results',
  function ($response) {
    global $restricted_fields;
    if ($restricted_fields === []) {
      return $response;
    }
    if (is_object($response) && isset($response->data['contentNode'])) {
      foreach ($response->data['contentNode'] as $key => $node) {
        if (!in_array($key, $restricted_fields) && $key !== '__typename') {
          unset($response->data['contentNode'][$key]);
        }
      }

      $response->data['contentNode']['seo']['metaRobotsNoindex'] = 'noindex';
      $response->data['contentNode']['seo']['metaRobotsNofollow'] = 'nofollow';
      global $bad_password;
      $response->data['contentNode']['badPassword'] = $bad_password;
    }
    return $response;
  },
  10,
  1,
);
