<?php

// import config

global $headless_domain;
global $headless_webhooks_password_protected;
global $headless_webhooks_graphcdn_purge_api;
global $headless_webhooks_post_types;
global $headless_webhooks_redirects_redirection;
global $headless_webhooks_redirects_yoast;

if ( isset($headless_domain) && WP_HOST != 'localhost' ) {
  $headless_webhooks_graphcdn_purge_api = $headless_domain . '/api/graphcdn/';
}

// Actions to apply purge on
// Can browse more here: https://github.com/mitcho/hookpress/blob/master/hooks.php
if ( $headless_webhooks_graphcdn_purge_api ) {
  add_action('acf/save_post', 'purge_options', 10, 2);
  add_action('wp_update_nav_menu', 'purge_menu', 10, 2);

  // Loop through post types and add actions
  foreach ( $headless_webhooks_post_types as $post_type ) {
    add_action('publish_' . $post_type, 'purge_post', 10, 2);
  }
}

// check if redirection is enabled
if ($headless_webhooks_redirects_redirection){
  add_action('redirection_redirect_deleted', 'purge_redirection', 10, 2);
  add_action('redirection_redirect_updated', 'purge_redirection', 10, 2);
}

function purge_redirection() {
  purge_post('redirects');
  remove_action('redirection_redirect_deleted', 'purge_redirection', 10,2);
  remove_action('redirection_redirect_updated', 'purge_redirection', 10,2);
}

// check if yoast_redirects enabled
if ($headless_webhooks_redirects_yoast){
  add_action('Yoast\WP\SEO\redirects_modified', 'purge_yoast', 10, 2);
  // deleted doesn't exist yet: https://github.com/Yoast/wordpress-seo/issues/17074
}

function purge_yoast() {
  purge_post('redirects');
  remove_action('Yoast\WP\SEO\redirects_modified', 'purge_yoast', 10,2);
}

// If production is protected with Vercel Password, we need to get a JWT
// https://vercel.com/docs/platform/frequently-asked-questions#bypassing-password-protection-programmatically

function vercel_jwt() {
  global $headless_webhooks_graphcdn_purge_api;

  error_log('-- Getting JWT from Vercel');

  $cookies = array();
  $headers = array();
  $headers[] = 'Content-Type: application/x-www-form-urlencoded';

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $headless_webhooks_graphcdn_purge_api);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_HEADER, 1);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
  curl_setopt($ch, CURLOPT_POSTREDIR, 1);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, "_vercel_password=preview");
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $response = curl_exec($ch);


  preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $response, $matches);

  foreach( $matches[1] as $item ) {
    parse_str($item, $cookie);
    $cookies = array_merge($cookies, $cookie);
  }

  if ( curl_errno($ch) ) {
    error_log('-- Cookie request failed');
    error_log(curl_error($ch));
  }

  curl_close($ch);

  if ( isset( $cookies['_vercel_jwt'] ) ){
    return $cookies['_vercel_jwt'];
  }

  return false;
}

// function purge_post($post_id, $post){
function purge_post( $post_id ) {
  global $headless_webhooks_graphcdn_purge_api;
  global $headless_webhooks_password_protected;

  error_log('-- Running Purge Cache API ' . $headless_webhooks_graphcdn_purge_api);
  error_log('-- WP_HOST ' . WP_HOST);

  $jwt = false;

  if ($headless_webhooks_password_protected && WP_HOST != 'localhost') {
    $jwt = vercel_jwt();
  }

  // Define an empty array
  $data = array();

  // Store the title into the array
  $data['post_id'] = $post_id;

  // Encode the data to be sent
  $json_data = json_encode($data);

  // Initiate the cURL
  $ch = curl_init($headless_webhooks_graphcdn_purge_api);
  curl_setopt($ch, CURLOPT_FAILONERROR, true); // Required for HTTP error codes to be reported via our call to curl_error($ch)
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $headers = array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($json_data)
  );

  // Skip SSL Verification on localhost
  if ( WP_HOST == 'localhost' ) {
    //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
  }

  if ( $jwt ) {
    array_push($headers, 'Cookie: _vercel_jwt=' . $jwt);
  }

  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

  // Execute
  $response = curl_exec($ch);

  if ( curl_errno($ch) ) {
    error_log('-- Purge attempt failed:');
    // error_log( 'Headers: ');
    // error_log( print_r($headers, true));
    error_log(curl_error($ch));
  } else {
    if ( WP_HOST == 'localhost' ) {
      $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      error_log( '-- Purge attempt succeeded');

      // error_log( 'Headers: ');
      // error_log( print_r($headers, true));
      // error_log( 'Status: ' . $http_code);
      // error_log( 'Response: ');
      // error_log( print_r($result, true));
    }
  }

  curl_close($ch);
}

function purge_options() {
  // Define an empty array
  $data = array();
  $screen = get_current_screen();
  global $headless_webhooks_acf_options;

  foreach ( $headless_webhooks_acf_options as $option ) {
    if (strpos($screen->id, $option) == true) {
      $data = array();

      // Store the title into the array
      $data['post_id'] = $option;
      purge_post($data['post_id']);
    }
  }
}

function purge_menu() {
  purge_post('menu');
  remove_action('wp_update_nav_menu', 'purge_menu', 10,2);
}

?>
