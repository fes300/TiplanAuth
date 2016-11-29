FROM node:7.0.0

MAINTAINER federico sordillo <federicosordillo@gmail.com>

# use nodemon for development
RUN npm install --global nodemon

CMD sudo apt-get install libstdc++6
CMD sudo add-apt-repository ppa:ubuntu-toolchain-r/test
CMD sudo apt-get upgrade
CMD sudo apt-get install vim
CMD sudo apt-get dist-upgrade

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

CMD [ "npm", "start" ]

EXPOSE 3001
