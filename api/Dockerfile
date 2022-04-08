# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
# FROM node:8-alpine also works here for a smaller image
FROM node:16.14-slim as prod

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=8000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

RUN npm i npm@latest -g

RUN mkdir /usr/app
WORKDIR /usr/app


COPY tsconfig.json ./
COPY package*.json ./

RUN npm i --unsafe-perm=true  --no-optional && npm cache clean --force


ENV PATH /usr/app/node_modules/.bin:$PATH

# RUN npm run build

# HEALTHCHECK --interval=30s CMD node healthcheck.js

COPY . .


# USER node


# if you want to use npm start instead, then use `docker run --init in production`
# so that signals are passed properly. Note the code in index.js is needed to catch Docker signals
# using node here is still more graceful stopping then npm with --init afaik
# I still can't come up with a good production way to run with npm and graceful shutdown
# CMD [ "node", "./bin/www" ]

FROM prod as dev

ENV NODE_ENV = development


RUN npm install 


ENTRYPOINT [ "npm", "run", "dev" ]
