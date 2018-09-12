# DT 2018 Santas little helper

## How-to local env

```shell
# install dependencies
yarn

# start the bot
yarn start
```

## How-to local env http tunnel

Start local tunnel with fixed URL 

```
yarn global add localtunnel

lt --port 3000 --subdomain dt2018-bot
```


## How to deploy to AWS Beanstalk

```shell
brew install awsebcli

eb init dt2018 \
  -p Docker \
  -r eu-west-1
# .. proceed with configuration screens

eb create dev-env
eb open
```