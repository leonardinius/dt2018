[![Build Status](https://travis-ci.org/leonardinius/dt2018.svg?branch=master)](https://travis-ci.org/leonardinius/dt2018)

# DT 2018 Santas little helper

## How-to local env

```shell
# install dependencies
yarn

# start the bot
yarn start
```

## How-to local env http tunnel

Start local tunnel with fixed URL:

```
# install localtunnel
yarn global add localtunnel

# start tunnel
lt --port 3000 --subdomain dt2018-bot
```

## How to deploy to AWS Beanstalk

```shell
# install beanstalk client (on MacOS)
brew install awsebcli

# install beanstalk client (on Linux/Windows)
pip install awsebcli --upgrade --user

# deploy bot
eb init dt2018 \
  -p Docker \
  -r eu-west-1

# .. proceed with configuration screens

eb create dev-env
eb open
```
