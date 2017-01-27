FROM node:7.0.0

MAINTAINER federico sordillo <federicosordillo@gmail.com>

CMD apt-get update
CMD apt-get install software-prop
CMD apt-get dist-upgrade
CMD apt-get upgrade

CMD apt-get install vim
CMD apt-get install libstdc++6

# install nodemon for development
RUN npm install --global nodemon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm install

CMD [ "npm", "start" ]

EXPOSE 3001
