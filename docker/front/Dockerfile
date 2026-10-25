FROM node:26-alpine3.23

RUN apk update  \
        && apk upgrade --no-cache  --force-overwrite --force-refresh --purge --available

RUN npm install -g @angular/cli

WORKDIR /www


#
# Configure user
#
ENV DOCKER_USER=www

ENV DOCKER_UID=1000
ENV DOCKER_GID=1000


#
# Add host user and group into container
#
RUN set -xe \
		&& deluser node \
		&& addgroup -g $DOCKER_GID $DOCKER_USER \
		&& adduser -g "web user" -s /bin/sh -D -u $DOCKER_UID -G $DOCKER_USER $DOCKER_USER \
		&& delgroup $DOCKER_USER $DOCKER_USER \
		&& echo "$DOCKER_USER:$DOCKER_USER" | chpasswd

#
# Working directory
#
WORKDIR /www
USER www