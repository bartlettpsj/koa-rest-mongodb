const bodyParser = require('koa-bodyparser');
const HttpStatus = require('http-status-codes');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const Str = require('./string_util');

// Todo..
// - Add logging
// - Review results
// - Unit Test
// - Authentication
// - include AJV schema validation
// - Body parser better sharing
// - Better validation and error handling - maybe try catch?

// Options:
//   db-
//   connectionString-


// This is a very simple rest to mongodb datasource service
// GET, HEAD, DELETE, POST, PUT, PATCH supported.
//  path: /collection/id?query={}&limit=1000&skip=100&sort=field1,field2:asc&fields=field1,field2,field3.child?db=test
//    collection mandatory
//    id mandatory for DELETE, PUT and PATCH, optional for GET, HEAD invalid for POST
//    parameters - same readme
//  body: contains JSON of object or objects

module.exports = function (opts) {

  opts = opts || {};

  const connectionString = opts.connectionString || 'mongodb://localhost:27017';
  const database = opts.db || 'database';
  const parser = bodyParser();

  const connectToDb = async (dbName) => {
    const client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
    return client.db(dbName);
  }

  return async (ctx, next) => {

    const method = ctx.method;
    const path = ctx.path;
    const pathParts = path.split('/');
    const collectionName = pathParts[1];
    const documentId = pathParts[2];
    const dbName = ctx.query.db || database;

    // ensure bodyParser runs first
    await parser(ctx, async ()=>{});
    const body = ctx.request.body;

    // Make sure we have collection
    if (!collectionName) {
      ctx.throw(HttpStatus.BAD_REQUEST, 'Collection Name missing');
    }

    // Make sure no more parts to path
    if (pathParts[3]) {
      ctx.throw(HttpStatus.BAD_REQUEST, 'Too many parts to path');
    }

    const checkDocumentId = () => {
      if (!documentId) {
        ctx.throw(HttpStatus.BAD_REQUEST, 'Document not specified');
      }
    }

    console.log(`${Date()}: ${method} request`); // need better logging

    const db = await connectToDb(dbName); // less code but lazy!
    let isGet = false;

    switch (method) {
      case 'GET':
        isGet = true;
      case 'HEAD': {
        let count;
        let result;
        const limit = ctx.query.limit;
        const skip = ctx.query.skip;
        const options = {};

        // setup skip and limit
        if (limit) options.limit = parseInt(limit);
        if (skip)  options.skip = parseInt(skip);

        let isCount = Str.equalsIgnoreCase(documentId, 'count');

        // Handle Query - Get record using id (if specified) and filter (if specified)
        let query = !isCount && documentId ? { _id: ObjectID(documentId) } : {};
        const filter = ctx.query.query;
        if (filter) {
          try {
          const filterObject = JSON.parse(filter); // likely to fail if bad format
          query = {...query, ...filterObject};
          } catch (err) {
            ctx.throw(HttpStatus.BAD_REQUEST, `Invalid query - must be stringified JSON - ${err.message}`);
          }
        }

        if (isCount) {
          result = await db.collection(collectionName).countDocuments(query, options);
          count = result;
        } else {
          if (isGet) {
            // setup projection
            const project = ctx.query.fields; // separated by comma, may be empty
            const fields = project ? project.split(',') : [];
            const projection = fields.reduce((r, v, k) => (r[v] = 1) && r, {});
            if (projection && Object.keys(projection).length>0) options.projection = projection;

            // setup order - [[field,ascending/descending],[field,.. from field:asc/desc,field,field....
            const order = ctx.query.sort;
            const rawFields = order ? order.split(',') : [];
            const sort = rawFields.map(rawField => {
              const f = rawField.split(':');
              return f.length >= 2 ? [f[0],f[1].toLowerCase().startsWith('d') ? 'descending' : 'ascending'] : [f[0], 'ascending'];
            })

            if (sort.length > 0) options.sort = sort;
          }

          result = await db.collection(collectionName).find(query, options).toArray();
          count = result.length;
        }

        if (isGet) ctx.body = result;
        ctx.status = isCount || count != 0 ? HttpStatus.OK : HttpStatus.NO_CONTENT;
        ctx.response.set('X-Document-Count', count);

        break;
      }
      case 'POST': {
        // Perform database insert, single or multiple records
        if (Array.isArray(body)) {
          const result = await db.collection(collectionName).insertMany(body);
          ctx.body = result.ops;
        } else {
          const result = await db.collection(collectionName).insertOne(body);
          ctx.body = Array.isArray(result) ? result.ops[0] : result.ops;
        }

        break;
      }
      case 'PATCH': {
        // Patch should so partial update - i.e. the $set for only specified fields
        checkDocumentId();

        const query = { _id: ObjectID(documentId) };
        const result = await db.collection(collectionName).updateOne(query, {$set: body}, { upsert: true });
        ctx.body = result;

        break;

      }
      case 'PUT': {
        // Effectively an upsert - update or else insert - ID must be present - https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6
        // Put is meant to replace the entire resource.
        checkDocumentId();

        const query = { _id: ObjectID(documentId) };
        const result = await db.collection(collectionName).replaceOne(query, body, { upsert: true });
        ctx.body = result;

        break;
      }
      case 'DELETE': {
        // currently only support delete individual and no query parameter allowed
        checkDocumentId();

        // Check that parameters are not specified

        const query = { _id: ObjectID(documentId) };
        const result = await db.collection(collectionName).deleteOne(query);
        ctx.body = result;

        break;
      }

      default: {
        console.log(`${method} method is not supported`);
      }
    }

    await next();
  };
}
