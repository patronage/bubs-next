<?php
// Disable a plugin based on environment. We don't want to purge cache during local/staging development
// unless needed for specific testing, in which case we can enable it using global variables in functions.php
// Also allows for listening to graphcdn_purge event to perform additional invalidation

// add_action('admin_init', 'disable_stellate_plugin');


function disable_stellate_plugin()
{
  $plugin_slug = 'stellate/wp-stellate.php';
  if (!defined('WP_STELLATE_ENABLED')) {
    if (defined('WP_HOST') && WP_HOST == "production") {
      global $stellate_production_enabled;
      if ($stellate_production_enabled) {
        define('WP_STELLATE_ENABLED', true);
      }
    }

    if (defined('WP_HOST') && WP_HOST == "staging") {
      global $stellate_staging_enabled;
      if ($stellate_staging_enabled) {
        define('WP_STELLATE_ENABLED', true);
      }
    }

    if (defined('WP_HOST') && WP_HOST == "development") {
      global $stellate_development_enabled;
      if ($stellate_development_enabled) {
        define('WP_STELLATE_ENABLED', true);
      }
    }
  }


  if (defined('WP_STELLATE_ENABLED') && WP_STELLATE_ENABLED) {
    // leave enabled
  } else {
    // disable
    deactivate_plugins($plugin_slug);
  }
}

global $stellate_purge_redirection;
global $stellate_purge_acf_options;

if ($stellate_purge_redirection) {
  function purge_redirection()
  {
    stellate_add_purge_entity('purged_types', 'RedirectionRedirects');
  }
  add_action('redirection_redirect_updated', 'purge_redirection');
  add_action('redirection_redirect_deleted', 'purge_redirection');
}

if ($stellate_purge_acf_options) {
  function purge_acf_options()
  {
    stellate_add_purge_entity('purged_types', 'AcfOptionsThemeSettings');
  }
  add_action('acf/options_page/save', 'purge_acf_options');
}

add_action('redirection_redirect_updated', 'purge_redirection');
add_action('redirection_redirect_deleted', 'purge_redirection');
add_action('acf/options_page/save', 'purge_acf_options');


function vercel_revalidate($urls)
{
  global $headless_domain;

  if (defined('WP_ENV') && WP_ENV == 'development') {
    $api_domain = 'http://host.docker.internal:3000';
  } else {
    $api_domain = $headless_domain;
  }

  $paths = [];

  if (!defined('HEADLESS_REVALIDATE_SECRET')) {
    error_log('HEADLESS_REVALIDATE_SECRET not defined');
    return;
  }

  foreach ($urls as $url) {
    if (strpos($url, '://')) {
      $parsed = parse_url($url);
      $url = $parsed['path'];
    }
    if ($url !== '/') {
      $url = rtrim($url, '/'); // Remove trailing slash
    }
    array_push($paths, $url);
  }

  $post_url = $api_domain . '/api/revalidate';

  $body = array(
    'paths' => $paths,
    'secret' => HEADLESS_REVALIDATE_SECRET
  );

  $args = array(
    'body' => json_encode($body),
    'headers' => array('Content-Type'  => 'application/json')
  );

  wp_remote_post($post_url, $args);
}

function stellate_purge_callback($purge_data)
{
  $paths = [];

  // Uncomment to add logs to debug.log
  // error_log('attempting handle_stellate_purge');
  // error_log(json_encode($purge_data));

  if ($purge_data['has_purged_all']) {
    $query = new WP_Query(array('posts_per_page' => -1, 'fields' => 'ids'));
    foreach ($query as $id) {
      array_push($paths, get_permalink($id));
    }
    vercel_revalidate($paths);
    return;
  }

  // Process purged types
  foreach ($purge_data['purged_types'] as $type) {
    $path = get_post_type_archive_link($type);
    if ($path) {
      array_push($paths, $path);
    }
  }

  if (isset($purge_data['purged_types'])) {
    unset($purge_data['purged_types']);
  }

  foreach ($purge_data as $type => $ids) {
    if (is_array($ids) && !empty($ids)) {
      foreach ($ids as $id) {
        $path = get_permalink($id);
        if ($path) {
          array_push($paths, $path);
        }
      }
    }
  }

  vercel_revalidate($paths);
}

add_action('stellate_purge', 'stellate_purge_callback', 10, 2);
