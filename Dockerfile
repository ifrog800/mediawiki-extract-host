FROM node:18-alpine3.16

WORKDIR /mediawiki-extract-host

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY src src
COPY tsconfig.json .

RUN npm run build-unix && \
    npm prune --production && \
    npm cache clean --force

CMD ["node", "dist/main.js"]
