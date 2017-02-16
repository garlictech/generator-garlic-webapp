#!/usr/bin/env bash
set -e
echo "Generating .env..."
echo "NODE_ENV=development" >> .env

DOCKER_RUN_CMD="docker-compose -f docker/docker-compose.webpack.yml run -T <%= conf.webpackServerName %>"
# /app/package_project.json is the package.json in this project, copied into the container.
echo "Updating package.json..."
${DOCKER_RUN_CMD} scripts/cat-package-json.sh > package.json
echo "Updating tsconfig.json..."
${DOCKER_RUN_CMD} cat tsconfig.webpack.json > tsconfig.json
echo "Updating tslint.json..."
${DOCKER_RUN_CMD} cat tslint.json > tslint.json