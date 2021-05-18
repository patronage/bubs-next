<?php

// in production, force GA login only
// this won't let people login with email/password
// so only enable when 100% of users have google accounts

function bubs_google_login_options($options) {
  if ( defined('WP_ENV') && WP_ENV == "development" ) {
    $options['ga_auto_login'] = false;
  } else {
    $options['ga_auto_login'] = true;
  }
  return ($options);
}
add_filter('gal_options', 'bubs_google_login_options');
?>
