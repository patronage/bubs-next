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

mkdir -p wp-content/uploads && chmod 777 wp-content/uploads
mkdir -p wp-content/themes/headless/acf-json && chmod -R 777 wp-content/themes/headless/acf-json
chmod +x _build/deploy.sh
