#!/usr/bin/env sh

# abort on errors
set -e

echo '====================================================================================='
echo '=============================...DEPLOYING STAGING...============================='
echo '====================================================================================='

npm run build

echo '====================================================================================='
echo '=====================================...BUILD...====================================='
echo '====================================================================================='

# navigate into the build output directory

rm -rf deploy
mkdir deploy
cp -r ./dist ./deploy/dist
cp -r ./src/ssl/staging/ ./deploy/dist/src/ssl/
cp -r ./package.json ./deploy/package.json
cp -r ./package-lock.json ./deploy/package-lock.json
cp -r .env.staging ./deploy/.env
cd deploy

git init
git add -A
git commit -m 'deploy'

echo '====================================================================================='
echo '==================================...PUSHING GIT...=================================='
echo '====================================================================================='
git push -f https://develop@203rvpt.bmdapp.store/plesk-git/203rvpt-backend.git master
cd -

rm -rf deploy
rm -rf dist

green=`tput setaf 2`
reset=`tput sgr0`
now=$(date +"%T")

echo "${green}====================================================================================="
echo "${green}=======================...DEPLOY SUCCESS STAGING AT $now...======================"
echo "${green}=====================================================================================${reset}"