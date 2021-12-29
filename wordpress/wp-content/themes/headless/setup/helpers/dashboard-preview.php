<?php

// remove widgets from the dashboard
// add a site links widget
// log WP users into the website front-end so they can view live content

add_action('wp_dashboard_setup', 'bubs_custom_dashboard_widgets');

function bubs_custom_dashboard_widgets() {
  global $wp_meta_boxes;

  // remove all
  // $wp_meta_boxes['dashboard']['normal']['core'] = array();
  // $wp_meta_boxes['dashboard']['side']['core'] = array();

  // add our custom one
  if (function_exists('build_preview_link')) {
    wp_add_dashboard_widget('preview_mode_widget', 'Preview Mode', 'preview_mode_widget');
  }
}

function preview_mode_widget() {
  global $headless_domain;
  global $docs_link;
?>
  <div>
    <p><strong>Site Links</strong></p>
    <ul>
      <li><a href="<?php echo $headless_domain; ?>">View Site</a></li>
      <? echo $docs_link ? '<li><a href="' . $docs_link . '">View Docs</a></li>' : '' ?>
      <li><a href="<?php echo build_preview_link(); ?>&path=/" target="_blank">Enable preview mode</a></li>
      <li><a href="<?php echo $headless_domain ?>/api/exit-preview" target="_blank">Disable preview mode</a></li>
    </ul>
  </div>
  <? if (function_exists('build_preview_link')) {
    echo "<iframe src=\"" . build_preview_link() . "\" style=\"width:1px;height:1px;opacity:0;\"></iframe>";
  }?>
<?php }
