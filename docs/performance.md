Outline:

- Memory Cache
- Links to WP graphql

## Graph CDN

### Purging with webhooks

Use the wp webhooks plugin

- Need to setup 4 webhooks manually.
- SQL you can use to set these up:

When working locally, you need to change the urls to point to your localhost -- but since WP is running into the container, the URL should be something like `http://192.168.86.101:3000/api/graphcdn/purge/post-update/`, not `https://site.vercel.app/api/graphcdn/purge/post-update.
you can use this snippet to help debug.

```php
function webhook_callback( $response, $url, $http_args, $webhook ) {
  error_log( print_r( $response, true ) );
}
add_action( 'wpwhpro/admin/webhooks/webhook_trigger_sent', 'webhook_callback', 10, 4 );
```

- Post to a catchall API route at /api/graphcdn/method
