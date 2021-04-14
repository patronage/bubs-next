#!/bin/bash

echo "acf permissions check"
yarn acf
git config --local core.fileMode false

echo "end post merge hook"
