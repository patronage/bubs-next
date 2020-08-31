## Update site url
UPDATE `wp_options` SET `option_value` = 'http://localhost:8000' WHERE `option_name` = 'siteurl';
UPDATE `wp_options` SET `option_value` = 'http://localhost:8000' WHERE `option_name` = 'home';

## Set local admin user login to: admin:password
UPDATE `wp_users` SET `user_login` = 'admin', `user_nicename` = 'admin' WHERE `ID` = '1';
UPDATE `wp_users` SET `user_pass` = '$P$BfuqvWHay8/zebob.mxuJvgSb.L0s4/' WHERE `ID` = '1';
