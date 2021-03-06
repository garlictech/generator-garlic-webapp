#!make
include .env
export $(shell sed 's/=.*//' .env)

DOCKER_IMAGE=${DOCKER_REGISTRY}/${PROJECT}-${DOCKER_IMAGE_SCOPE}

ifeq ($(TRAVIS_BRANCH), master)
  DOCKER_IMAGE=${DOCKER_REGISTRY}/${PROJECT}-prod
endif

DEV_SERVICE_NAME=${PROJECT}.dev
DOCKER_COMPOSE_BASE = docker-compose -f docker/docker-compose.yml
SYSTEMTEST_SERVICE_NAME=${PROJECT}.systemtest.runner
DOCKER_COMPOSE = ${DOCKER_COMPOSE_BASE}
DOCKER_RUN = ${DOCKER_COMPOSE} run --rm ${DEV_SERVICE_NAME}
DOCKER_RUN_NODEPS = ${DOCKER_COMPOSE} run --no-deps --rm ${DEV_SERVICE_NAME}
DOCKER_COMPOSE_SYSTEMTEST = docker-compose -f docker/docker-compose.systemtest.yml -f docker/docker-compose.dependencies.yml
DOCKER_RUN_SYSTEMTEST = ${DOCKER_COMPOSE_SYSTEMTEST} run --service-ports --rm ${SYSTEMTEST_SERVICE_NAME}

.PHONY: build dist start unittest systemtest login bash docker-login

# Build the development services.
build:
	-rm -rf project/src/*/node_modules project/src/subrepos/*/node_modules
	${DOCKER_COMPOSE} build
	${DOCKER_RUN_NODEPS} gulp compile

build-prod:
	docker build --build-arg NPM_TOKEN=${NPM_TOKEN_PioneerWst} -t ${DOCKER_IMAGE} -f Dockerfile .

build-all:
	-${DOCKER_COMPOSE} rm -f -v
	-docker rmi ${DOCKER_IMAGE}
	-docker rmi ${DEV_SERVICE_NAME}
	-${DOCKER_COMPOSE} pull
	${DOCKER_COMPOSE} build --no-cache

# Start the development server and the defined services. It also watches for file changes. In this case, it re-runs the unit tests and restarts the server.
start:
	${DOCKER_COMPOSE} up

# Stop the development server and the defined services.
stop:
	${DOCKER_COMPOSE} kill

# Execute the system tests
systemtest-build:
	${DOCKER_COMPOSE_SYSTEMTEST} pull
	${DOCKER_COMPOSE_SYSTEMTEST} build

clean:
	-rm -rf project/src/*/node_modules project/src/subrepos/*/node_modules
	-rm -rf dist

unittest:
	${DOCKER_RUN_NODEPS} gulp unittest

systemtest-compile:
	 ${DOCKER_COMPOSE_SYSTEMTEST} build

systemtest-run: systemtest-compile
	${DOCKER_RUN_SYSTEMTEST}

# The system test runner spins up all the dependencies, executes the system tests once, and exits. There are no logs of the dependencies displayed. If you want to see the whole picture, use:.
systemtest-run-d: systemtest-compile
	 ${DOCKER_COMPOSE_SYSTEMTEST} up

systemtest: systemtest-build
	${DOCKER_RUN_SYSTEMTEST}

# Start bash in the development service
bash:
	${DOCKER_RUN_NODEPS} /bin/bash

# Push the distribution image to the registry
docker-push:
	docker push ${DOCKER_IMAGE}

docker-pull:
	${DOCKER_COMPOSE_PROD} pull

# Tag the image after the latest npm tag
docker-tag:
	scripts/tag-image.sh

# Login to the docker registry of the project
docker-login:
	scripts/docker-login.sh

lint:
	${DOCKER_RUN_NODEPS} npm run lint

prettier:
	${DOCKER_RUN_NODEPS} npm run prettier
