#!/bin/sh

WORDPRESS_DB_HOST="127.0.0.1"
WORDPRESS_DB_PORT=3307
WORDPRESS_DB_USER="root"
WORDPRESS_DB_PASSWORD="somewordpress"
WORDPRESS_DB_NAME="bubsnext"

## Ideally these would work without having to hardcode above
## instead coming from docker ENV
sql=`ls -Art _data/* | tail -n 1`
echo $sql
ext=${sql##*.}

if [ $ext = "zip" ]; then
    unzip -p $sql | mysql -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -h $WORDPRESS_DB_HOST -P $WORDPRESS_DB_PORT $WORDPRESS_DB_NAME
elif [ $ext = "gz" ]; then
    gunzip < $sql | mysql -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -h $WORDPRESS_DB_HOST -P $WORDPRESS_DB_PORT $WORDPRESS_DB_NAME
else
    mysql -u mysql -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -h $WORDPRESS_DB_HOST -P $WORDPRESS_DB_PORT $WORDPRESS_DB_NAME < $sql
fi

# run local mods if present
file="_data/local.sql"
if [ -f "$file" ]
then
    mysql -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -h $WORDPRESS_DB_HOST -P $WORDPRESS_DB_PORT $WORDPRESS_DB_NAME < $file
    echo "$file imported."
else
    echo "$file not found."
fi

echo 'import complete'
