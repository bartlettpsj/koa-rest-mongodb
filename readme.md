koa_rest_mongodb
----------------

After starting the server you can quickly try it out by issuing the following from the command line:

curl "localhost:3000/api/names?db=test" -H "content-type: application/json" -d '[{"name": "many", "age": 7, "address": { "first": "178 main lane", "zip": "92123"}}, {"test": 123}, {"third": "hello mr third"}, { "noschema": true }]'

This should add 3 documents to the collection names in database test:


Supported REST requests

GET /collection
Returns all documents in collection

GET /collection/id
Returns document with id

GET /collection?where={}&limit=1000&skip=100&order=field1,field2:asc&fields=field1,field2,field3.child
Returns all documents in collection

POST /collection
Insert new document in collection (document(s) in POST body)

PUT /collection/id
Update document with id (update document in PUT body)

DELETE /collection/id
Delete document with id

parameters includes:
- where - query in json object as per mongodb (GET only)
- limit - integer (GET only)
- skip - integer (GET only)
- order - field list in order, with asc or desc (GET only)
- fields - field list used for projection (GET only)
- db - database name - Default defined in the service, but user can override.
- options - comma separated flags i.e. returndata, returnstatus

- support filters in mongodb similar to loopback
- support aggregate queries?
- support getting ID from the body - NO not very restful

- Authentication to be implemented - passport / loopback?
