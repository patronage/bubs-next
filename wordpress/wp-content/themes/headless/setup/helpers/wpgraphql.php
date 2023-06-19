<?php
//
// Enable customizations for WPGraphQL here
//
// Example: increase the amount of posts that can be returned in a query
//
//   add_filter( 'graphql_connection_max_query_amount', function( $amount, $source, $args, $context, $info ) {
//     return 1000;
//   }, 10, 5 );
//
// Example: Add a JSON response to GraphQL to cache API responses along with graphql
//
//    function getAPI() {
//      return [
//          'type' => 'String',
//          'description' => 'API Response',
//          'resolve' => function ($post_model, $args, $context, $info) {
//              // This ID is for the actual ACF fields and can be found by var_dumping $post_model to find your field
//              $formID = $post_model['field_63d06c8f955a5_field_63d06955536e5'];
//
//              if ($formID) {
//                  $rawResponse = file_get_contents("https://example.com/resource/" . $formID );
//                  return $rawResponse;
//              }
//
//              return null;
//          }
//      ];
//    }
//
//    register_graphql_field('Template_Flex_Acfflex_FlexContent_ApiFlex', 'apiResults', getAPI());
//
