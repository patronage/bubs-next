<?php

//
// Headless Theme Options
//

$wp_customize->add_section('headless', [
    'title' => 'Headless',
    'priority' => 20,
]);

// Fields

$wp_customize->add_setting('headless_preview_url', [
    'default' => '',
]);
$wp_customize->add_control('headless_preview_url', [
    'label' => 'Preview URL',
    'section' => 'headless',
    'settings' => 'headless_preview_url',
    'type' => 'text',
]);
