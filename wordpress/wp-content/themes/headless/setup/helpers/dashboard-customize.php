<?php

// remove widgets from the dashboard if set in the config
// add links to the dashboard for the website and docs
// log WP users into the website front-end so they can view live content (headless)

add_action('wp_dashboard_setup', 'bubs_custom_dashboard_widgets');

function bubs_custom_dashboard_widgets() {
    global $wp_meta_boxes;
    global $dashboard_cleanup;
    global $docs_link;

    if ($dashboard_cleanup) {
        // remove all
        $wp_meta_boxes['dashboard']['normal']['core'] = [];
        $wp_meta_boxes['dashboard']['side']['core'] = [];
    }
    // add our custom one if enabled
    if (function_exists('build_preview_link') || $docs_link) {
        wp_add_dashboard_widget('bubs_custom_dashboard_widget', 'Custom Theme Support', 'bubs_custom_dashboard_widget');

        // move our custom one to the top
        // https://wordpress.stackexchange.com/a/48989
        // Get the regular dashboard widgets array
        // (which has our new widget already but at the end)
        $normal_dashboard = $wp_meta_boxes['dashboard']['normal']['core'];

        // Backup and delete our new dashbaord widget from the end of the array
        $example_widget_backup = ['bubs_custom_dashboard_widget' => $normal_dashboard['bubs_custom_dashboard_widget']];
        unset($normal_dashboard['bubs_custom_dashboard_widget']);

        // Merge the two arrays together so our widget is at the beginning
        $sorted_dashboard = array_merge($example_widget_backup, $normal_dashboard);

        // Save the sorted array back into the original metaboxes
        $wp_meta_boxes['dashboard']['normal']['core'] = $sorted_dashboard;
    }
}

function bubs_custom_dashboard_widget() {
    global $headless_domain;
    global $docs_link;?>
<div>
    <p>Theme specific links to help you run this website</p>
    <ul>
        <?
            if ($headless_domain){
                echo '<li><a href="' . $headless_domain . '" target="_blank">View Website</a></li>';
            }
            if ($docs_link){
              echo $docs_link ? '<li><a href="' . $docs_link . '">View Docs</a></li>' : '';
            }
            if (function_exists('build_preview_link')) {
                echo '<li><a href="' . build_preview_link() . '&path=/" target="_blank">Enable preview mode</a></li>';
                echo '<li><a href="' . $headless_domain . '/api/exit-preview" target="_blank">Disable preview mode</a></li>';
            }
        ?>
    </ul>
</div>
<? if (function_exists('build_preview_link')) {
    echo "<iframe src=\"" . build_preview_link() . "\" style=\"width:1px;height:1px;opacity:0;\"></iframe>";
  }
?>
<?php
}
