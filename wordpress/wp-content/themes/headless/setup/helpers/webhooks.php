<?php

// set paths
$graphcdn_purge_api = false;
// $graphcdn_purge_api = 'http://192.168.1.66:3000/api/graphcdn/';
if ( defined('HEADLESS_DOMAIN') && WP_HOST != 'localhost' ){
  $graphcdn_purge_api = HEADLESS_DOMAIN . '/api/graphcdn/';
}

// Actions to apply purge on
// Can browse more here: https://github.com/mitcho/hookpress/blob/master/hooks.php
if ($graphcdn_purge_api){
  add_action('acf/save_post', 'purge_options', 10,2);
  add_action('publish_post', 'purge_post', 10,2);
  add_action('publish_page', 'purge_post', 10,2);
  add_action('wp_update_nav_menu', 'purge_menu', 10,2);
}

// If production is protected with Vercel Password, we need to get a JWT
// https://vercel.com/docs/platform/frequently-asked-questions#bypassing-password-protection-programmatically
$password_protected = true;

function vercel_jwt(){
  global $graphcdn_purge_api;
  $ch = curl_init();

  curl_setopt($ch, CURLOPT_URL, $graphcdn_purge_api);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_HEADER, 1);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, "_vercel_password=preview");

  $headers = array();
  $headers[] = 'Content-Type: application/x-www-form-urlencoded';
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

  $result = curl_exec($ch);

  preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $result, $matches);
  $cookies = array();
  foreach($matches[1] as $item) {
    parse_str($item, $cookie);
    $cookies = array_merge($cookies, $cookie);
  }

  if (curl_errno($ch)) {
    error_log('cookie request to ' .$graphcdn_purge_api. ' failed');
    error_log(curl_error($ch));
  } else {
    error_log('cookie request to ' .$graphcdn_purge_api. ' succeeded');
    // error_log( 'Cookies: ');
    // error_log( print_r($cookies, true));
  }

  curl_close($ch);

  if (isset($cookies['_vercel_jwt'])){
    return $cookies['_vercel_jwt'];
  }

  return false;


}

// function purge_post($post_id, $post){
function purge_post($post_id){
    global $graphcdn_purge_api;
    global $password_protected;
    error_log( '------------');
    $jwt = false;
    if ($password_protected && WP_HOST != 'localhost'){
      $jwt = vercel_jwt();
    }
    // Define an empty array
    $data = array();
    // Store the title into the array
    $data['post_id'] = $post_id;
    // If there is a post thumbnail, get the link

    // Encode the data to be sent
    $json_data = json_encode($data);
    // Initiate the cURL
    $ch = curl_init($graphcdn_purge_api);
    curl_setopt($ch, CURLOPT_FAILONERROR, true); // Required for HTTP error codes to be reported via our call to curl_error($ch)
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $headers = array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($json_data)
    );

    if ( WP_HOST == 'localhost' ) {
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); // Skip SSL Verification
    }
    if ($jwt){
      array_push($headers, 'Cookie: _vercel_jwt='. $jwt);
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Execute
    $result = curl_exec($ch);
    if (curl_errno($ch)) {
      error_log( 'Errored webhook attempt to: ' . $graphcdn_purge_api);
      // error_log( 'Headers: ');
      // error_log( print_r($headers, true));
      error_log(curl_error($ch));
    } else {
      if ( WP_HOST == 'localhost' ) {
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        error_log( 'Success webhook attempt to: ' . $graphcdn_purge_api);
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
  if (strpos($screen->id, "acf-options-theme-settings") == true) {
    $data = array();
    // Store the title into the array
    $data['post_id'] = 'acf-options-theme-settings';
    purge_post($data['post_id']);
  }
}

function purge_menu() {
  purge_post('menu');
  remove_action('wp_update_nav_menu', 'purge_menu', 10,2);
}

?>
