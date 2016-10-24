# Nametag
#
# VERSION               0.0.1

FROM node
MAINTAINER David Jay <davidgljay@gmail.com>

LABEL description="Used to start the Nametag server"
LABEL updated="10/9/16"
RUN apt-get update
COPY $PWD/.hz /usr/app/.hz
COPY $PWD/.keys /usr/app/.keys
COPY $PWD/dist /usr/app/dist
COPY $PWD/server  /usr/server

WORKDIR usr/server
RUN npm install
CMD bash
