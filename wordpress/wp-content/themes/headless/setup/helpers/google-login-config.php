<?php

//
// Customize the Google Apps Login plugin
//

// By default the cookie gets set globally, breaking varnish caching. Only set on login page.
function bubs_gal_set_login_cookie($dosetcookie) {
    return $GLOBALS['pagenow'] == 'wp-login.php';
}
add_filter('gal_set_login_cookie', 'bubs_gal_set_login_cookie');

// Login page front end adjusts
// Remove the default login fields, unless "emaillogin" in the query string
// Commented out by default, but enable the action if you want to enable this

function bubs_login_customization() {

    $str = <<<'EOD'
        <!-- ng-wp-login-page -->
        <style type="text/css">
            /* ng-wp-login additional styles */
            .galogin-or {
                display: none;
            }
        </style>
        <script>
            var ngWpLogin = function(){
                //hide login fields
                if ( ( window.location.href.indexOf('emaillogin') === -1  ) && (window.location.href.indexOf('lostpassword') === -1 ) ){
                    document.querySelectorAll('#login #nav,.galogin-or,[for="user_login"],[for="user_pass"],.forgetmenot,.submit').forEach(function( el, i){
                      el.parentNode.removeChild(el);
                    })
                }
            };

            document.addEventListener('DOMContentLoaded', ngWpLogin);
        </script>
EOD;

    echo $str;
}

if ( !defined( 'WP_LOCAL_DEV' ) || !WP_LOCAL_DEV ) {
    add_action( 'login_enqueue_scripts', 'bubs_login_customization' );
}

?>
