<?php

//
// Add Menus to Wordpress
//

function bubs_register_nav_menu(){
  register_nav_menus(array(
    'header' => 'Header Navigation',
    'footer' => 'Footer Navigation',
    'footer_secondary' => 'Footer Secondary Navigation',
    'footer_social' => 'Social',
  ));
}

add_action( 'after_setup_theme', 'bubs_register_nav_menu', 0 );

?>
