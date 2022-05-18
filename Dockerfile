FROM node:16.13.0 AS development

WORKDIR /usr/src/app

COPY package*.* ./

RUN npm install glob rimraf
RUN npm install ansi-styles -g


RUN npm install

COPY . .

RUN npm run build

FROM node:16.13.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.* ./

RUN npm install
RUN npm install --ignore-scripts=false --verbose


COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
