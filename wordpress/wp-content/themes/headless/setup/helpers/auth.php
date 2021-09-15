<?php

/*
*
* Code adapted and modified from https://github.com/wpengine/headless-framework/tree/canary/plugins/wpe-headless
* Last updated: 08/05/2021
*
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$auth_secret = defined('HEADLESS_AUTH_SECRET') ? HEADLESS_AUTH_SECRET : '';

/**
 * Generate an access token given a user.
 *
 * @uses wpe_headless_generate_user_code()
 *
 * @param WP_User $wp_user A WP_User object.
 *
 * @return string|bool An encrypted string or false.
 */
function wpe_headless_generate_access_token( $wp_user ) {
	return wpe_headless_generate_user_code( $wp_user, 'at' );
}

/**
 * Generate an authentication code given a user.
 *
 * @uses wpe_headless_generate_user_code()
 *
 * @param WP_User $wp_user A WP_User object.
 *
 * @return string|bool An encrypted string or false.
 */
function wpe_headless_generate_authentication_code( $wp_user ) {
    return wpe_headless_generate_user_code( $wp_user, 'ac' );
}

/**
 * Get a WP_User given an authentication code.
 *
 * @uses wpe_headless_get_user_from_code()
 *
 * @param string $code     A base 64 encoded string.
 * @param int    $duration The duration in seconds to remain valid.
 *
 * @return WP_User|bool A WP_User object or false.
 */
function wpe_headless_get_user_from_authentication_code( $code, $duration ) {
	return wpe_headless_get_user_from_code( $code, 'ac', $duration );
}

/**
 * Get a WP_User given an access token.
 *
 * @uses wpe_headless_get_user_from_code()
 *
 * @param string $token    A base 64 encoded string.
 * @param int    $duration The duration in seconds to remain valid.
 *
 * @return WP_User|bool A WP_User object or false.
 */
function wpe_headless_get_user_from_access_token( $token, $duration ) {
	return wpe_headless_get_user_from_code( $token, 'at', $duration );
}

/**
 * Generate an encrypted code for the given WP_User and type.
 *
 * @uses wpe_headless_encrypt()
 *
 * @param WP_User $wp_user A WP_User object.
 * @param string  $type    The type of code. Either 'ac' or 'at'.
 *
 * @return string|bool An encrypted string or false if failure.
 */
function wpe_headless_generate_user_code( $wp_user, $type ) {
	if ( empty( $wp_user->ID ) ) {
		return false;
	}

	return wpe_headless_encrypt( "{$type}|{$wp_user->ID}|" . time() );
}

/**
 * Get a WP_User given a base 64 encoded code.
 *
 * @param string $code     The base64 encoded encrypted code.
 * @param string $type     The type of code. Either 'ac' or 'at'.
 * @param int    $duration The max duration to compare to the timestamp.
 *
 * @return WP_User|bool A WP_User object or false.
 */
function wpe_headless_get_user_from_code( $code, $type, $duration ) {
	$code = wpe_headless_decrypt( $code );
	if ( ! $code ) {
		return false;
	}

	$parts = explode( '|', $code );
	if ( count( $parts ) < 3 ) {
		return false;
	}

	if ( $type !== $parts[0] ) {
		return false;
	}

	if ( time() - absint( $parts[2] ) > $duration ) {
		return false;
	}

	return get_user_by( 'ID', absint( $parts[1] ) );
}


/**
 * Encrypt a value.
 *
 * @uses openssl_encrypt()
 * @link https://www.php.net/manual/en/function.openssl-encrypt.php
 *
 * @param string $value The value to encrypt.
 *
 * @return string|bool The encrypted value as a base 64 encoded string or false.
 */
function wpe_headless_encrypt( $value ) {
    global $auth_secret;
    $secret_key = $auth_secret;

	if ( ! $secret_key ) {
		return false;
	}

	$iv          = openssl_random_pseudo_bytes( openssl_cipher_iv_length( 'AES-256-CBC' ) );
	$cipher_text = openssl_encrypt( $value, 'AES-256-CBC', $secret_key, OPENSSL_RAW_DATA, $iv );

	if ( ! $cipher_text ) {
		return false;
	}

	$hash = hash_hmac( 'sha256', $cipher_text, $secret_key, true );

	return base64_encode( $iv . $hash . $cipher_text ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
}

/**
 * Decrypt a value.
 *
 * @uses openssl_decrypt()
 * @link https://www.php.net/manual/en/function.openssl-decrypt.php
 *
 * @param string $value The base 64 encoded value.
 *
 * @return string|bool The decrypted value or false.
 */
function wpe_headless_decrypt( $value ) {
    global $auth_secret;
	$secret_key      = $auth_secret;
	$decrypted_value = false;

	if ( ! $secret_key ) {
		return $decrypted_value;
	}

	$value       = base64_decode( $value ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode
	$iv_length   = openssl_cipher_iv_length( 'AES-256-CBC' );
	$iv          = substr( $value, 0, $iv_length );
	$hash        = substr( $value, $iv_length, 32 );
	$cipher_text = substr( $value, $iv_length + 32 );
	$hash_comp   = hash_hmac( 'sha256', $cipher_text, $secret_key, true );

	if ( hash_equals( $hash, $hash_comp ) ) {
		$decrypted_value = openssl_decrypt( $cipher_text, 'AES-256-CBC', $secret_key, OPENSSL_RAW_DATA, $iv );
	}

	return $decrypted_value;
}

add_filter( 'determine_current_user', 'wpe_headless_rest_determine_current_user', 20 );
/**
 * Callback for WordPress 'determine_current_user' filter.
 *
 * Determine the current user based on authentication token from http header.
 * Runs during GraphQL, REST and plain requests.
 *
 * @link https://developer.wordpress.org/reference/hooks/determine_current_user/
 *
 * @param int|bool $user_id User ID if one has been determined, false otherwise.
 *
 * @return int|bool User ID if one has been determined, false otherwise.
 */
function wpe_headless_rest_determine_current_user( $user_id ) {
	if ( $user_id ) {
		return $user_id;
	}

	if ( ! isset( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
		return $user_id;
	}

	$parts = explode( ' ', trim( $_SERVER['HTTP_AUTHORIZATION'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
	if ( count( $parts ) < 2 ) {
		return $user_id;
	}

	$wp_user = wpe_headless_get_user_from_access_token( $parts[1], 2 * HOUR_IN_SECONDS );
	if ( $wp_user ) {
		$user_id = $wp_user->ID;
	}

	return $user_id;
}

add_action( 'rest_api_init', 'wpe_headless_register_rest_routes' );

/**
 * Callback for WordPress 'rest_api_init' action.
 *
 * Register the POST /wpac/v1/authorize endpoint.
 *
 *
 * @link https://developer.wordpress.org/reference/functions/register_rest_route/
 * @link https://developer.wordpress.org/rest-api/extending-the-rest-api/routes-and-endpoints/
 *
 * @return void
 */
function wpe_headless_register_rest_routes() {
	register_rest_route(
		'wpac/v1',
		'/authorize',
		array(
			'methods'             => 'POST',
			'callback'            => 'wpe_headless_handle_rest_authorize_callback',
			'permission_callback' => 'wpe_headless_rest_authorize_permission_callback',
		)
	);
}

/**
 * Callback for WordPress register_rest_route() 'callback' parameter.
 *
 * Handle POST /wpac/v1/authorize response.
 *
 * Use the 'code' (authentication code) parameter to generate a new access token.
 *
 * @link https://developer.wordpress.org/reference/functions/register_rest_route/
 * @link https://developer.wordpress.org/rest-api/extending-the-rest-api/routes-and-endpoints/#endpoint-callback
 *
 * @param WP_REST_Request $request Current WP_REST_Request object.
 *
 * @return mixed A WP_REST_Response, array, or WP_Error.
 */
function wpe_headless_handle_rest_authorize_callback( WP_REST_Request $request ) {
	$code = trim( $request->get_param( 'code' ) );
	if ( ! $code ) {
		return new WP_Error( 'authentication_code_required', __( 'Authentication code required', 'wpe-headless' ), array( 'status' => 400 ) );
	}

	$wp_user = wpe_headless_get_user_from_authentication_code( $code, MINUTE_IN_SECONDS );
	if ( ! $wp_user ) {
		return new WP_Error( 'invalid_authentication_code', __( 'Invalid authentication code', 'wpe-headless' ), array( 'status' => 400 ) );
	}

	$access_token = wpe_headless_generate_access_token( $wp_user );
	if ( ! $access_token ) {
		return new WP_Error( 'access_token_error', __( 'Access token error', 'wpe-headless' ) );
	}

    $response = new WP_REST_Response(compact( 'access_token' ), 200);

	return $response;
}

/**
 * Callback for WordPress register_rest_route() 'permission_callback' parameter.
 *
 * Authorized if the 'secret_key' settings value and http header 'x-wpe-headless-secret' match.
 *
 * @link https://developer.wordpress.org/reference/functions/register_rest_route/
 * @link https://developer.wordpress.org/rest-api/extending-the-rest-api/routes-and-endpoints/#permissions-callback
 *
 * @param WP_REST_Request $request The current WP_REST_Request object.
 *
 * @return bool True if current user can, false if else.
 */
function wpe_headless_rest_authorize_permission_callback( WP_REST_Request $request ) {
	$secret_key = defined('HEADLESS_API_SECRET') ? HEADLESS_API_SECRET : '';
	$header_key = $request->get_header( 'x-wpe-headless-secret' );

	if ( $secret_key && $header_key ) {
		return $secret_key === $header_key;
	}

	return false;
}
