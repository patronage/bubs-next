#!/bin/bash

## Per Project Variables -- CUSTOMIZE THESE FIRST
PRODUCTION_REMOTE="git@git.wpengine.com:production/bubsnext.git"
STAGING_REMOTE="git@git.wpengine.com:production/bubsnexts.git"
DEVELOPMENT_REMOTE="git@git.wpengine.com:production/bubsnextd.git"
GIT_EMAIL="hello+bubs@patronage.org"
GIT_NAME="Bubs Deploy"

# read txt files with list of files to include/exclude
function get_array {
    i=0
    while read line # Read a line
    do
        array[i]=$line # Put it into the array
        i=$(($i + 1))
    done < $1
}

# handle script errors, exit and kick you to working branch
function error_exit {
    echo "$1" 1>&2
    echo "Aborting and returning to working branch."
    git stash
    git checkout $branch
    exit 1
}

# Ref: https://stackoverflow.com/questions/8223906/how-to-check-if-remote-branch-exists-on-a-given-remote-repository
# test if the branch is in the remote repository.
# return 1 if its remote branch exists, or 0 if not.
function is_in_remote() {
    local remote=${1}
    local branch=${2}
    local existed_in_remote=$(git ls-remote --heads ${remote} ${branch})

    if [[ -z ${existed_in_remote} ]]; then
        return 1
    else
        return 0
    fi
}

function wpe_deploy() {
    local TARGET=${1}
    local REMOTE=${2}
    local BRANCH=${3}

    echo "Pushing to ${TARGET}..."
    git remote rm ${TARGET}
    git remote add ${TARGET} ${REMOTE}
    cd ..
    
    # check if master exists on remote
    if is_in_remote ${TARGET} "master"; then
        echo "WP engine ready for deploy, proceeding"
        git push -u ${TARGET} `git subtree split --prefix wordpress deploy`:master --force
        echo "Returning to working branch."
        git stash
        git checkout ${BRANCH}
    else
        echo "First time deploy, prepping remote with empty file"
        mkdir tmp
        cd tmp
        echo 'Hello, world.' > tmp.txt
        git init
        git add . && git commit --no-verify -am "comment"
        git remote add ${TARGET} ${REMOTE}
        git push -f ${TARGET} master
        echo "Remote ready, cleaning up"
        cd ..
        rm -rf tmp
        echo "Remote now ready, please try deploying again to populate."
        echo "Returning to working branch."
        git stash
        git checkout  ${BRANCH}
    fi
}


# check environment to ensure we should proceed with build
if [[ -n $(git status --porcelain) ]]; then
    error_exit "There are uncommited changes -- please commit before proceeding."
elif [ ! -z "$TRAVIS_BRANCH" ] && [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    error_exit "This is a pull request, don't build"
else

    ## on travis, add credentials
    if [ ! -z "$TRAVIS_BRANCH" ]; then
        echo -e "Host git.wpengine.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
        git config --global user.email ${GIT_EMAIL}
        git config --global user.name ${GIT_NAME}
    fi

    if [ `git branch --list deploy` ]; then
       echo "Branch deploy already exists, deleting then continuing"
       git branch -D deploy
    fi

    # save current branch to a variable
    branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

    git checkout -b deploy
    # gulp release || error_exit "Gulp release failed."

    echo "Adding built files that are normally .gitignored..."
    array=()
    get_array "_build/.deploy_include.txt"
    for e in "${array[@]}"
    do
        printf "$e\n"
        git add -f "$e"
    done
    echo "trying to add again just to confirm"
    git add -f "wp-content/plugins"
    git status

    echo "Removing files we don't want on the server"
    array=()
    get_array "_build/.deploy_exclude.txt"
    for e in "${array[@]}"
    do
        git rm -r --ignore-unmatch "$e" -f
    done

    echo "Committing build changes"
    git commit --no-verify -m "Committing build changes"

    ## travis deploy based on branch
    ## TODO: switch to github actions
    if [ "$TRAVIS_BRANCH" = "main" ]; then
        echo "Pushing to production..."
        git remote add production ${PRODUCTION_REMOTE}
        git push -f production deploy:main

    elif [ ! -z "$TRAVIS_BRANCH" ]; then
        echo "Pushing to staging..."
        git remote add staging ${STAGING_REMOTE}
        git push -f staging deploy:main

    elif [ "$1" = "staging" ] || [ "$1" = "stage" ]; then
        wpe_deploy "staging" ${STAGING_REMOTE} $branch

    elif [ "$1" = "development" ] || [ "$1" = "dev" ]; then
        wpe_deploy "development" ${DEVELOPMENT_REMOTE} $branch

    elif [ "$1" = "production" ] || [ "$1" = "prod" ]; then
        wpe_deploy "production" ${PRODUCTION_REMOTE} $branch
    else
        error_exit "No deploy conditions met. Specify a target (staging, development, production)"
    fi

    ## test for git response, and if error code, bail out of travis with an error code
    success=$?
    if [[ $success -eq 0 ]];
    then
        echo "Build script complete"
    else
        error_exit "Something went wrong with the deploy."
    fi
fi
