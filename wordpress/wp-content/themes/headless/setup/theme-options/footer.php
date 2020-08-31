<?php

//
// Footer Section
//

$wp_customize->add_section( 'footer', array(
    'title'     =>  'Footer',
    'priority'  =>  20
));

// Fields

$wp_customize->add_setting( 'footer_copyright', array(
    'default' => ''
));
$wp_customize->add_control( 'footer_copyright', array(
    'label'     => 'Footer Copyright (do not need copyright or year)',
    'section'   => 'footer',
    'settings'  => 'footer_copyright',
    'type'      => 'text'
));
