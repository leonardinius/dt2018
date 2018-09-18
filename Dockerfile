FROM node:8.12.0-alpine

LABEL maintainer="Leo <leonidms@gmail.com>"

EXPOSE 3000

WORKDIR /app
COPY . /app
RUN yarn

CMD ["node", "bot.js"]