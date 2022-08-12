#!/bin/sh

## env export, with unset at end of script
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

WORDPRESS_DB_USER="root"
WORDPRESS_DB_PASSWORD="somewordpress"
WORDPRESS_DB_NAME=${COMPOSE_PROJECT_NAME:-wordpress}
DB_CONTAINER="${COMPOSE_PROJECT_NAME:-wordpress}_db_1"
PRODUCTION_SSH="${COMPOSE_WPE_PRODUCTION}@${COMPOSE_WPE_PRODUCTION}.ssh.wpengine.net"

function db_import() {
  sql=`ls -Art _data/* | tail -n 1`
  echo $sql
  ext=${sql##*.}

  if [ $ext = "zip" ]; then
    unzip -p $sql | docker exec -i $DB_CONTAINER mysql -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -D $WORDPRESS_DB_NAME
  elif [ $ext = "gz" ]; then
    gunzip < $sql | docker exec -i $DB_CONTAINER mysql -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -D $WORDPRESS_DB_NAME
  else
    docker exec -i $DB_CONTAINER mysql -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -D $WORDPRESS_DB_NAME < $sql
  fi

  # run local mods if present
  file="_data/local.sql"
  if [ -f "$file" ]
  then
    docker exec -i $DB_CONTAINER mysql -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -D $WORDPRESS_DB_NAME < $file
    echo "$file imported."
  else
    echo "$file not found."
  fi

  if [ -f ".env" ]; then
    unset $(grep -v '^#' .env | sed -E 's/(.*)=.*/\1/' | xargs)
  fi

  echo 'import complete'
}

function db_export() {
  echo "$PRODUCTION_SSH";
  wp db export --add-drop-table --ssh=$PRODUCTION_SSH - | gzip > _data/$(date +'%Y-%m-%d-%H-%M-%S').sql.gz
  echo "export complete";
}

CALLED_FUNCTION=${1}

if [ "$CALLED_FUNCTION" = "export" ]; then
  echo "running DB export script"
  db_export
elif [ "$CALLED_FUNCTION" = "import" ]; then
  echo "running DB import script"
  db_import
else
  error_exit "Specify a DB task (export or import)"
fi

if [ -f ".env" ]; then
  unset $(grep -v '^#' .env | sed -E 's/(.*)=.*/\1/' | xargs)
fi
