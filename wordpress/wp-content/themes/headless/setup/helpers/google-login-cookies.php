<?php

# Only set cookies on login page, to prevent breaking caching
# https://wp-glogin.com/docs/api/login-hooks/#gal_set_login_cookie

function bubs_gal_set_login_cookie($dosetcookie) {
  // Only set cookie on wp-login.php page
  return $GLOBALS['pagenow'] == 'wp-login.php';
}
add_filter('gal_set_login_cookie', 'bubs_gal_set_login_cookie');

?>
