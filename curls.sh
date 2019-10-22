#!/bin/bash

# curl -s "localhost:3000/api/names?db=paul1" -H "content-type: application/json" \
#   -d '[{"name": "many", "age": 7, "address": { "first": "178 main lane", "zip": "92123"}}, {"test": 123}, {"third": "numberofthis"}]'

# curl -s "localhost:3000/api/craft?db=aviation" -H "content-type: application/json" \
#   -d '{"name": "Concorde"}'  

# curl -s "localhost:3000/api/craft?db=aviation" -H "content-type: application/json" \
#   -d '{"name": "Jumbo"}'  

# curl -s "localhost:3000/api/craft?db=aviation" -H "content-type: application/json" \
#   -d '{"name": "707"}'  

# id=$(curl -s "localhost:3000/api/craft?db=aviation" -H "content-type: application/json" \
#   -d '{"name": "Old Plane"}'  | jq -r '._id')

# curl -s -X "PATCH" "localhost:3000/api/craft/$id?db=aviation" -H "content-type: application/json" \
#   -d '{"wheels": 16, "approved": false}'  

# curl -s -X "PUT" "localhost:3000/api/craft/$id?db=aviation" -H "content-type: application/json" \
#   -d '{"name": "overwritten"}'  

# curl -s "localhost:3000/api/craft/count" -H "content-type: application/json"

# curl -i "localhost:3000/api/craft/count" -H "content-type: application/json"

# curl -I "localhost:3000/api/craft/count" -H "content-type: application/json"

# One for each Method 

# POST - returns the document added included the generated _id
echo "Adding 3 documents"
curl localhost:3000/api/color -w "\n" -d '{"name":"red"}' -H "content-type: application/json"
curl localhost:3000/api/color -w "\n" -d '{"name":"green"}' -H "content-type: application/json"
curl localhost:3000/api/color -w "\n" -d '{"name":"blue"}' -H "content-type: application/json"

# GET - returns documents - i.e. red, green, blue
echo -e "\nReturning all 3 documents - check the header too"
curl -is -w "\n" localhost:3000/api/color

# GET - query for _id of colored document
echo -e "\nGetting individual documents using queries"
red=$(curl -sg 'localhost:3000/api/color?query={"name":"red"}' | jq -r '.[] | ._id')
green=$(curl -sg 'localhost:3000/api/color?query={"name":"green"}' | jq -r '.[] | ._id')
blue=$(curl -sg 'localhost:3000/api/color?query={"name":"blue"}' | jq -r '.[] | ._id')
echo red: $red, green: $green, blue: $blue

# UPDATE the red one
echo -e "\nUpdating the red one"
curl -X "PATCH" localhost:3000/api/color/$red -w "\n" -d '{"flower":"rose"}' -H "content-type: application/json"

# GET - display the patched red document
curl -sg -w "\n" 'localhost:3000/api/color?query={"name":"red"}'

# DELETE - delete the colored documents
echo -e "\nDeleting all documents individually"
curl -X "DELETE" localhost:3000/api/color/$red
curl -X "DELETE" localhost:3000/api/color/$green
curl -X "DELETE" localhost:3000/api/color/$blue
echo

# GET/count - prove there are no documents
echo -e "\nProving there are no documents remaining"
curl -s -i -w "\n" localhost:3000/api/color/count