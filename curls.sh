#!/bin/bash

curl -s "localhost:3000/api/names?db=paul1" -H "content-type: application/json" \
  -d '[{"name": "many", "age": 7, "address": { "first": "178 main lane", "zip": "92123"}}, {"test": 123}, {"third": "numberofthis"}]'

curl -s "localhost:3000/api/craft?db=aviation" -H "content-type: application/json" \
  -d '{"name": "Concorde"}'  

curl -s "localhost:3000/api/craft?db=aviation" -H "content-type: application/json" \
  -d '{"name": "Jumbo"}'  

curl -s "localhost:3000/api/craft?db=aviation" -H "content-type: application/json" \
  -d '{"name": "707"}'  

id=$(curl -s "localhost:3000/api/craft?db=aviation" -H "content-type: application/json" \
  -d '{"name": "Old Plane"}'  | jq -r '._id')

curl -s -X "PATCH" "localhost:3000/api/craft/$id?db=aviation" -H "content-type: application/json" \
  -d '{"wheels": 16, "approved": false}'  

curl -s -X "PUT" "localhost:3000/api/craft/$id?db=aviation" -H "content-type: application/json" \
  -d '{"name": "overwritten"}'  

curl -s "localhost:3000/api/craft/count" -H "content-type: application/json"

curl -i "localhost:3000/api/craft/count" -H "content-type: application/json"

curl -I "localhost:3000/api/craft/count" -H "content-type: application/json"