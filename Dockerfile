FROM node:10-alpine as builder
RUN mkdir -p build
WORKDIR /build
COPY src src
COPY .babelrc .
COPY package.json .
COPY yarn.lock .
RUN yarn install
RUN yarn build

FROM alekzonder/puppeteer:latest
ENV NODE_ENV "production"
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY --from=builder /build/dist dist
CMD ["node", "dist/index.js"]
