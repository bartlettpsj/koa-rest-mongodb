curl "localhost:3000/api/names?db=paul1" -H "content-type: application/json" \
  -d '[{"name": "many", "age": 7, "address": { "first": "178 main lane", "zip": "92123"}}, {"test": 123}, {"third": "numberofthis"}]'

