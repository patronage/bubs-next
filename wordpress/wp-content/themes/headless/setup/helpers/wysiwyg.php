<?php
    //
    // TinyMCE Customization
    //
    // Docs: http://codex.wordpress.org/TinyMCE_Custom_Styles
    // Callback function to insert 'styleselect' into the $buttons array
    //

    function my_mce_buttons_2( $buttons ) {
        array_unshift( $buttons, 'styleselect' );
        return $buttons;
    }
    // Register our callback to the appropriate filter
    // add_filter('mce_buttons_2', 'my_mce_buttons_2');

    //
    // Add custom classes to select
    //
    function my_mce_before_init_insert_formats( $init_array ) {
        // Define the style_formats array
        $style_formats = array(
            // Each array child is a format with it's own settings
            array(
                'title' => 'Lede',
                'selector' => 'p',
                'classes' => 'para-lede',
                'wrapper' => false,
            ),
            array(
                'title' => 'Light',
                'selector' => 'p',
                'classes' => 'para-light',
                'wrapper' => false,
            ),
            array(
                'title' => 'Text Red',
                'inline' => 'span',
                'classes' => 'text-red',
                'wrapper' => true,
            )
        );
        // Insert the array, JSON ENCODED, into 'style_formats'
        $init_array['style_formats'] = json_encode( $style_formats );
        // customize block options
        $init_array['block_formats'] = "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6;";
        return $init_array;
    }
    // Attach callback to 'tiny_mce_before_init'
    // add_filter( 'tiny_mce_before_init', 'my_mce_before_init_insert_formats' );


    //
    // Custom styles in editor
    // https://www.mattcromwell.com/dynamic-tinymce-editor-styles-wordpress/
    // Adds styles from customizer to head of TinyMCE iframe.
    //

    function mce_add_editor_style( $mceInit ) {
        $styles = '.mce-content-body { max-width: 770px; font-family: sans-serif; }';
        $styles .= '.mce-content-body p.para-lede { font-size: 125%; }';
        $styles .= '.mce-content-body p.para-light { font-size: 75%; }';
        $styles .= '.mce-content-body .text-red { color: red; }';
        $styles .= '.mce-content-body iframe { max-width: 100%; }';

        if ( !isset( $mceInit['content_style'] ) ) {
            $mceInit['content_style'] = $styles . ' ';
        } else {
            $mceInit['content_style'] .= ' ' . $styles . ' ';
        }

        return $mceInit;
    }
    // add_filter( 'tiny_mce_before_init', 'mce_add_editor_style' );

    //
    // Set default values for the upload media box
    //

    function custom_image_size() {
        update_option('image_default_size', 'full' );
    }
    add_action('after_setup_theme', 'custom_image_size');

?>
