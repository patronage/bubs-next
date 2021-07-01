# clear plugins to force new versions (excluding non-Wordpress plugin composer-libs/ )
shopt -s extglob
rm -rf ./wp-content/plugins/!(composer-libs)


# clean composer before copying
rm -rf ./composer/wp/wp-config-sample.php
rm -rf ./composer/wp/wp-content/
mv -n ./composer/wp/* ./composer
rm -rf ./composer/wp/

# copy everything over
cp -R ./composer/* ./
# remove unwanted defaults
rm -rf wp-content/plugins/akismet/
rm -rf wp-content/plugins/hello.php

# init files if they don't exist
mkdir -p wp-content/mu-plugins
cp -n _init/local-plugins.php wp-content/mu-plugins/local-plugins.php 2>/dev/null || :
# mv _init/README.md README.md 2>/dev/null || :

# WP permissions
git config core.fileMode false
mkdir -p wp-content/uploads && chmod 777 wp-content/uploads
mkdir -p wp-content/themes/headless/acf-json && chmod -R 777 wp-content/themes/headless/acf-json
chmod +x _build/deploy.sh
