#!/bin/bash

# 同时发送请求

for i in {1..200}
do
  # curl http://localhost:4000/ --cacert ./my_crt > /dev/null 2>&1 &
  curl http://localhost:4000/ &
done
