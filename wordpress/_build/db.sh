#!/bin/sh

## env export, with unset at end of script
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file required, please copy from the .env.sample"
  exit 1;
fi

## Per Project Variables -- CUSTOMIZE THESE FIRST IN .ENV
WORDPRESS_DB_USER="root"
WORDPRESS_DB_PASSWORD="somewordpress"
WORDPRESS_DB_NAME=${COMPOSE_PROJECT_NAME:-wordpress}
PRODUCTION_SSH="${COMPOSE_WPE_PRODUCTION}@${COMPOSE_WPE_PRODUCTION}.ssh.wpengine.net"
STAGING_SSH="${COMPOSE_WPE_STAGING}@${COMPOSE_WPE_STAGING}.ssh.wpengine.net"
DEVELOPMENT_SSH="${COMPOSE_WPE_DEVELOPMENT}@${COMPOSE_WPE_STAGING}.ssh.wpengine.net"
SQL_EXCLUDED_TABLES="${SQL_EXCLUDED_TABLES}"

# handle script errors, exit and kick you to working branch
function error_exit {
  echo "$1" 1>&2
  echo "Aborting export attempt"
  exit 1
}

function db_import() {
  # get the docker container
  containers=$(docker ps --format "{{.Image}}|{{.Names}}")
  for str in ${containers[@]}; do
    if [[ $str == *${COMPOSE_PROJECT_NAME}* ]] && [[ $str == *"mariadb"* ]]; then
      DB_CONTAINER=${str#*|}
    fi
  done

  if [ -z ${DB_CONTAINER+x} ]; then
    error_exit "Couldn't find a DB container for '$COMPOSE_PROJECT_NAME', please make sure it is running."
  else
    echo "DB container '$DB_CONTAINER' detected; proceeding with import";
  fi

  sql=$(ls -Art _data/* | grep -v "local.sql" | tail -n 1)
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
  local TARGET=${1}

  if [ "$TARGET" = "staging" ]; then
    SSH_TARGET=$STAGING_SSH
  elif [ "$TARGET" = "development" ]; then
    SSH_TARGET=$DEVELOPMENT_SSH
  else
    SSH_TARGET=$PRODUCTION_SSH
  fi

  echo "connecting to $SSH_TARGET"

  status=$(ssh -o BatchMode=yes -o ConnectTimeout=5 $SSH_TARGET echo ok 2>&1)

  if [[ $status == ok ]] ; then
    echo "auth ok, proceeding with export"
    if ! command -v wp &> /dev/null
    then
      error_exit "'wp' command could not be found. WP CLI local install required to export DB"
    else
      mkdir -p _data
      filename=$(date +'%Y-%m-%d-%H-%M-%S').sql.zip
      wp db export --add-drop-table --exclude_tables=$SQL_EXCLUDED_TABLES --ssh=$SSH_TARGET - | gzip > _data/$(date +'%Y-%m-%d-%H-%M-%S').sql.gz
      echo "export complete";
    fi
  elif [[ $status == "Permission denied"* ]] ; then
    echo no_auth
  elif [[ $status == "Host key verification failed"* ]] ; then
    echo "host key not yet verified, please run: ssh $SSH_TARGET then try again"
  else
    echo "SSH couldn't connect, please check that environments are defined in your .env, and your SSH key is added to WP Engine"
  fi
}

function media_export() {
  local TARGET=${1}

  if [ "$TARGET" = "staging" ]; then
    SSH_TARGET=$STAGING_SSH
    PROJECT=$COMPOSE_WPE_STAGING
  elif [ "$TARGET" = "development" ]; then
    SSH_TARGET=$DEVELOPMENT_SSH
    PROJECT=$COMPOSE_WPE_DEVELOPMENT
  else
    SSH_TARGET=$PRODUCTION_SSH
    PROJECT=$COMPOSE_WPE_PRODUCTION
  fi

  # We don't need all thumbnails, just the original files
  EXCLUDE_REGEX="*[0-9]*x[0-9]*\.[a-zA-Z0-9]*"

  echo "connecting to $SSH_TARGET"

  status=$(ssh -o BatchMode=yes -o ConnectTimeout=5 $SSH_TARGET echo ok 2>&1)

  if [[ $status == ok ]] ; then
    echo "auth ok, proceeding with media export"
    rsync -rlD -vz --size-only --exclude=$EXCLUDE_REGEX $SSH_TARGET:sites/$PROJECT/wp-content/uploads/ ./wp-content/uploads/
    echo "export complete";
  elif [[ $status == "Permission denied"* ]] ; then
    echo no_auth
  elif [[ $status == "Host key verification failed"* ]] ; then
    echo "host key not yet verified, please run: ssh $SSH_TARGET then try again"
  else
    echo "SSH couldn't connect, please check that environments are defined in your .env, and your SSH key is added to WP Engine"
  fi
}

CALLED_FUNCTION=${1}
TARGET=${2}

if [ "$CALLED_FUNCTION" = "export" ]; then
  echo "Running DB export for $TARGET"
  db_export $TARGET
elif [ "$CALLED_FUNCTION" = "import" ]; then
  echo "running DB import script"
  db_import
elif [ "$CALLED_FUNCTION" = "media" ]; then
  echo "running media export script"
  media_export
else
  error_exit "Specify a DB task (export or import)"
fi

if [ -f ".env" ]; then
  unset $(grep -v '^#' .env | sed -E 's/(.*)=.*/\1/' | xargs)
fi
