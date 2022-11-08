# Development stage
FROM node:16.13.0 AS development

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@latest -g

# install dependencies first, in a different location for easier app bind mounting for local development
RUN mkdir /usr/app

WORKDIR /usr/app

RUN mkdir uploads

COPY package*.* ./

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

# Production stage
FROM node:16.13.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG UID=1001
ARG GID=1001

RUN usermod -u $UID node && groupmod -g $GID node

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

# due to default permissions we have to create the dir with root and change perms
RUN mkdir /usr/app && chown node:node /usr/app

WORKDIR /usr/app

USER node

RUN mkdir uploads

COPY --chown=node:node package*.* ./

# Set prepare script to '' to prevent husky install after - npm install
RUN npm set-script prepare ""

RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node --from=development /usr/app/dist ./dist

CMD ["node", "dist/src/main"]
