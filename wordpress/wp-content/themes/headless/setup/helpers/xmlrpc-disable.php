<?php

// https://blog.wpscan.com/2021/01/25/wordpress-xmlrpc-security.html
// https://www.scottbrownconsulting.com/2020/03/two-ways-to-fully-disable-wordpress-xml-rpc/

function remove_xmlrpc_methods( $methods ) {
  return array();
}
add_filter( 'xmlrpc_methods', 'remove_xmlrpc_methods' );

?>
