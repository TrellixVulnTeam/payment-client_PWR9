FROM node:12 as builder
# Docker context: frontend folder
WORKDIR /app/frontend
# Cache layer, almost no change
COPY .npmrc /app/frontend/.npmrc
COPY package.json /app/frontend/package.json
COPY yarn.lock /app/frontend/yarn.lock
COPY packages/loki/package.json /app/frontend/packages/loki/package.json
COPY core /app/frontend/core
RUN  yarn
# No cache, change frequently
ARG SERVICE
ARG ENV
COPY . /app/frontend/
RUN cd /app/frontend/packages/$SERVICE && yarn build:$ENV

FROM nginx:alpine
ARG SERVICE
ARG ENV
WORKDIR /app/
EXPOSE 80
COPY utils/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/packages/$SERVICE/build /app/html
