koa_rest_mongodb
================

After starting the server you can quickly try it out by issuing the following from the command line:

curl "localhost:3000/api/names?db=test" -H "content-type: application/json" -d '[{"name": "many", "age": 7, "address": { "first": "178 main lane", "zip": "92123"}}, {"test": 123}, {"third": "hello mr third"}, { "noschema": true }]'

This should add 3 documents to the name collection in database test:

Supported REST requests
-----------------------

Methods: GET, HEAD, POST, PUT, PATCH, DELETE

GET /collection
Returns all documents in collection

GET /collection/id
Returns document with id

GET /collection/count?query={"name":{"$gt":"A"}&limit=1000&skip=100
Counts number of documents in collection filtered by query with limit and skip

GET /collection?query={"name":{"$gt":"A"}&limit=1000&skip=100&sort=field1,field2:asc&fields=field1,field2
Returns all documents in collection
- filtered by query 
- projecting only specified fields -
- in sort order 
- with skip and limit

HEAD /collection?query={"name":{"$gt":"A"}&limit=1000&skip=100&sort=field1,field2:asc&fields=field1,field2
Same as /GET but only returns header containing X-Document-Count, no body

POST /collection
Insert new document in collection (document(s) in POST body)

PUT /collection/id
Update document with id (update document in PUT body)

PATCH /collection/id
Update document with fields in body

DELETE /collection/id
Delete document with id

parameters includes:
- query - query in json object as per mongodb (GET/HEAD only)
- limit - integer (GET only)
- skip - integer (GET only)
- sort - field list in order, with asc or desc (GET/HEAD only)
- fields - field list used for projection (GET/HEAD only)
- db - database name - Default defined in the service, but user can override.

- support aggregate queries?
- Authentication to be implemented - passport / loopback?
