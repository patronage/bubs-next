<?php
// This file configures and manages the Stellate plugin for different environments.
// It includes functions to:
// 1. Update the Stellate purging token in the database
// 2. Configure the plugin based on the current environment (staging, development, production)
// 3. Handle cache purging for various WordPress actions not supported by Stellate:
// - Redirections
// - ACF options
// The configuration can be controlled via global variables set in functions.php

/**
 * Updates the Stellate purging token in the database.
 * This function directly updates the option in the database,
 * bypassing WordPress's option API to ensure the update occurs.
 * It also clears the options cache and logs the update process if logging is enabled.
 *
 * @param string $token The new token to be set.
 */
function update_stellate_token($token) {
  global $wpdb, $stellate_logging_enabled;

  // Directly update the option in the database
  $wpdb->update(
    $wpdb->options,
    ['option_value' => $token],
    ['option_name' => 'stellate_purging_token'],
  );

  // Force refresh of the alloptions cache
  wp_cache_delete('alloptions', 'options');

  if ($stellate_logging_enabled) {
    error_log('Stellate: Updated purging token');
  }
}

/**
 * Configures the Stellate plugin based on the current environment.
 * This function sets up the Stellate service name and purging token
 * for different environments (staging, development, localhost, production).
 * We need this because we don't want to purge cache during local/staging development.
 * It's hooked to run after all plugins are loaded.
 */
function configure_stellate_plugin() {
  global $stellate_staging_service_name, $stellate_staging_purging_token;
  global $stellate_development_service_name, $stellate_development_purging_token;
  global $stellate_production_enabled, $stellate_staging_enabled, $stellate_development_enabled;

  if (!defined('WP_HOST')) {
    return;
  }

  $config = [
    'staging' => [
      'enabled' => $stellate_staging_enabled,
      'service_name' => $stellate_staging_service_name,
      'purging_token' => $stellate_staging_purging_token,
    ],
    'development' => [
      'enabled' => $stellate_development_enabled,
      'service_name' => $stellate_development_service_name,
      'purging_token' => $stellate_development_purging_token,
    ],
    'production' => [
      'enabled' => $stellate_production_enabled,
    ],
  ];

  $env = WP_HOST;

  if ($env === 'localhost' && defined('WP_STELLATE_CONFIG')) {
    $env = WP_STELLATE_CONFIG;
  }

  if (isset($config[$env]) && $config[$env]['enabled']) {
    if (isset($config[$env]['service_name'])) {
      update_option('stellate_service_name', $config[$env]['service_name']);
    }
    if (isset($config[$env]['purging_token'])) {
      update_stellate_token($config[$env]['purging_token']);
    }
    if (!defined('WP_STELLATE_ENABLED')) {
      define('WP_STELLATE_ENABLED', true);
    }
  }

  // with configs now defined, we will deactivate the plugin if it's not enabled
  $plugin_slug = 'stellate/wp-stellate.php';
  if (!defined('WP_STELLATE_ENABLED') || !WP_STELLATE_ENABLED) {
    deactivate_plugins($plugin_slug);
  }
}

// Add this action to run after plugins are loaded
// add_action('plugins_loaded', 'configure_stellate_plugin', 20);
add_action('admin_init', 'configure_stellate_plugin');

global $stellate_purge_redirection;
global $stellate_purge_acf_options;

/**
 * Handles purging of redirects in Stellate.
 * This function is called when redirects are added, updated, deleted, enabled, or disabled.
 * It purges the specific redirect from Stellate and revalidates the URL in Vercel.
 *
 * @param mixed $redirect The redirect object or ID.
 */
function purge_redirection($redirect) {
  global $stellate_logging_enabled;
  $origin = null;

  // Determine the origin URL of the redirect
  if (is_numeric($redirect)) {
    // This is likely a new redirect being created
    if ($stellate_logging_enabled) {
      error_log("Stellate: New redirect created with ID: {$redirect}");
    }
    // Get the redirect details
    $redirect_object = Red_Item::get_by_id($redirect);
    if ($redirect_object) {
      $origin = $redirect_object->get_url();
    }
  } elseif (is_object($redirect) && method_exists($redirect, 'get_url')) {
    $origin = $redirect->get_url();
  } else {
    $origin = $redirect;
  }

  if ($origin) {
    if ($stellate_logging_enabled) {
      error_log("Stellate: Purging redirection - Origin: {$origin}");
    }

    // Purge the specific redirect in Stellate
    $query = "mutation PurgeRedirect {
            purgeType: _purgeType(type: \"RedirectionRedirects\")
        }";

    $variables = [
      'origin' => $origin,
      'soft' => get_option('stellate_soft_purge') === 'on',
    ];

    $err = stellate_call_admin_api($query, $variables);

    if ($err) {
      error_log('Stellate: Error purging redirect - ' . $err);
    } else {
      error_log("Stellate: Successfully purged redirect - Origin: {$origin}");

      // Revalidate the URL in Vercel
      vercel_revalidate([$origin]);
    }
  } else {
    if ($stellate_logging_enabled) {
      error_log('Stellate: Unable to determine origin for redirect');
    }
  }
}

/**
 * Sets up the redirection purging functionality if enabled.
 * This function adds the necessary action hooks for redirect events.
 */
function setup_redirection_purging() {
  global $stellate_logging_enabled;
  global $stellate_purge_redirection;

  if ($stellate_purge_redirection && function_exists('stellate_call_admin_api')) {
    // Add hooks for various redirect events
    add_action('redirection_redirect_added', 'purge_redirection');
    add_action('redirection_redirect_updated', 'purge_redirection');
    add_action('redirection_redirect_deleted', 'purge_redirection');
    add_action('redirection_redirect_disabled', 'purge_redirection');
    add_action('redirection_redirect_enabled', 'purge_redirection');
  }
}

// Call the setup function
setup_redirection_purging();

/**
 * Purges the ACF options from Stellate cache.
 * This function is called when ACF options are saved.
 */
function purge_acf_options() {
  global $stellate_logging_enabled;

  if ($stellate_logging_enabled) {
    error_log('Stellate: Purging ACF options');
  }

  stellate_add_purge_entity('AcfOptionsThemeSettings', 1);

  if ($stellate_logging_enabled) {
    error_log('Stellate: ACF options purged');
  }
}

/**
 * Sets up the ACF options purging functionality if enabled.
 * This function adds the necessary action hook for ACF options saving event.
 */
function setup_acf_options_purging() {
  global $stellate_logging_enabled;
  global $stellate_purge_acf_options;

  if ($stellate_purge_acf_options) {
    add_action('acf/options_page/save', 'purge_acf_options');

    if ($stellate_logging_enabled) {
      error_log('Stellate: ACF options purging set up');
    }
  }
}

// Call the setup function
setup_acf_options_purging();

/**
 * Sends a revalidation request to Vercel for the specified URLs.
 * This function handles both development and production environments,
 * and logs the process if logging is enabled.
 * In preview, we use the Bypass Protection header to bypass the protection
 * https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
 *
 * @param array $urls The URLs to be revalidated.
 */
function vercel_revalidate($urls) {
  global $headless_domain;
  global $stellate_logging_enabled;
  global $vercel_protection_bypass;

  if (defined('WP_ENV') && WP_ENV == 'development') {
    $port = isset($_ENV['PORT']) ? $_ENV['PORT'] : '3000';
    $api_domain = "http://host.docker.internal:$port";
  } else {
    $api_domain = $headless_domain;
  }

  $paths = [];

  if (!defined('HEADLESS_REVALIDATE_SECRET')) {
    if ($stellate_logging_enabled) {
      error_log('Stellate: HEADLESS_REVALIDATE_SECRET not defined');
    }
    return;
  }

  foreach ($urls as $url) {
    if (strpos($url, '://') !== false) {
      $parsed = parse_url($url);
      $url = $parsed['path'];
    } else {
      // Handle relative paths
      $url = '/' . ltrim($url, '/');
    }
    if ($url !== '/') {
      $url = rtrim($url, '/'); // Remove trailing slash
    }
    array_push($paths, $url);
  }

  $post_url = $api_domain . '/api/revalidate';

  $body = [
    'paths' => $paths,
    'secret' => HEADLESS_REVALIDATE_SECRET,
  ];

  $args = [
    'body' => json_encode($body),
    'headers' => ['Content-Type' => 'application/json'],
    'timeout' => 10, // default of 5 seconds needs a little more time
  ];

  if (isset($vercel_protection_bypass)) {
    $args['headers']['x-vercel-protection-bypass'] = $vercel_protection_bypass;
  }

  if ($stellate_logging_enabled) {
    error_log('Stellate: Sending revalidation request to: ' . $post_url);
    error_log('Stellate: Revalidation response body: ' . json_encode($body));
  }

  $response = wp_remote_post($post_url, $args);

  if ($stellate_logging_enabled) {
    if (is_wp_error($response)) {
      error_log('Stellate: Revalidation request failed: ' . $response->get_error_message());
    } else {
      error_log(
        'Stellate: Revalidation request response code: ' .
          wp_remote_retrieve_response_code($response),
      );
      error_log(
        'Stellate: Revalidation request response body: ' . wp_remote_retrieve_body($response),
      );
    }
  }
}

/**
 * Handles Stellate purge requests
 *
 * This function processes purge data from Stellate, collects paths to be purged,
 * and initiates the revalidation process for those paths.
 *
 * @param array $purge_data The purge data received from Stellate
 */
function stellate_purge_callback($purge_data) {
  global $stellate_logging_enabled;
  $paths = [];

  if ($stellate_logging_enabled) {
    error_log('Stellate: Attempting handle_stellate_purge');
    error_log('Stellate: Purge data: ' . json_encode($purge_data));
  }

  if ($purge_data['has_purged_all']) {
    if ($stellate_logging_enabled) {
      error_log('Stellate: Purging all content');
    }
    $query = new WP_Query(['posts_per_page' => -1, 'fields' => 'ids']);
    foreach ($query as $id) {
      $path = get_permalink($id);
      array_push($paths, $path);
      if ($stellate_logging_enabled) {
        error_log('Stellate: Adding path to purge: ' . $path);
      }
    }
    vercel_revalidate($paths);
    return;
  }

  // Process purged types
  foreach ($purge_data['purged_types'] as $type) {
    if ($type === 'RedirectionRedirects') {
      // We can skip, we handle this in the redirection function above
    } else {
      $path = get_post_type_archive_link($type);
      if ($path) {
        array_push($paths, $path);
        if ($stellate_logging_enabled) {
          error_log('Stellate: Adding archive path to purge: ' . $path);
        }
      }
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
          if ($stellate_logging_enabled) {
            error_log('Stellate: Adding individual path to purge: ' . $path);
          }
        }
      }
    }
  }

  if ($stellate_logging_enabled) {
    error_log('Stellate: Total paths to purge: ' . count($paths));
    error_log('Stellate: Paths to purge: ' . implode(', ', $paths));
  }

  vercel_revalidate($paths);
}

add_action('stellate_purge', 'stellate_purge_callback', 10, 2);