FROM node:8.12.0-alpine

LABEL maintainer="Leo <leonidms@gmail.com>"

EXPOSE 3000
ENV NPM_CONFIG_LOGLEVEL info
ENV DEBUG false

WORKDIR /app
COPY . /app
RUN chmod +x /app/docker/start.sh
RUN yarn

CMD ["/app/docker/start.sh"]