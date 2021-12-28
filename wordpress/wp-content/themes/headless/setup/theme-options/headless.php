<?php

//
// Headless Theme Options
//

$wp_customize->add_section( 'headless', array(
    'title'     =>  'Headless',
    'priority'  =>  20
));

// Fields

$wp_customize->add_setting( 'headless_preview_url', array(
    'default' => ''
));
$wp_customize->add_control( 'headless_preview_url', array(
    'label'     => 'Preview URL',
    'section'   => 'headless',
    'settings'  => 'headless_preview_url',
    'type'      => 'text'
));
