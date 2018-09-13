#! /bin/sh

mkdir -p /var/log/dt2018
node bot.js | tee -a /var/log/dt2018/dt2018.log