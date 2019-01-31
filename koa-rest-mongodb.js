const bodyParser = require('koa-bodyparser');
const HttpStatus = require('http-status-codes');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const addTrailingSlash = (part) => part.substr(-1) != '/' ? part + '/' : part;
const addLeadingSlash = (part) => part.substr(0,1) != '/' ? '/' + part : part;

// This is a very simple rest to mongodb datasource service
// GET, DELETE, POST, PUT supported.
//  path: /endpoint/collection/id?where={}&limit=1000&skip=100&order=field1,field2:asc&fields=field1,field2,field3.child?db=test
//    endpoint - could be multiple i.e. /api/v1
//    collection mandatory
//    id mandatory for DELETE and PUT, optional for GET, invalid for POST
//    parameters - same readme
//  body: contains JSON of object or objects

module.exports = function (opts) {

  opts = opts || {};

  const endpoint = opts.endpoint || '';
  const fullendpoint = addTrailingSlash(addLeadingSlash(endpoint));
  const connectionString = opts.connectionString || 'mongodb://localhost:27017';
  const database = opts.db || 'database';
  const parser = bodyParser();

  const connectToDb = async (dbName) => {
    const client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
    return await client.db(dbName);
  }

  return async (ctx, next) => {

    const method = ctx.method;
    const path = ctx.path;

    // need to ignore requests not destined to us
    if (!path.startsWith(fullendpoint)) return await next();

    // Split up the path removing the endpoint and splitting into parts - *** NEED TO TEST/FIX WITH NO ENDPOINT***
    const requestPath = (path.startsWith(fullendpoint)) ? path.substr(fullendpoint.length) : path;
    const pathParts = requestPath.split('/');
    const collectionName = pathParts[0];
    const documentId = pathParts[1];    
    const dbName = ctx.query.db || database;

    // ensure bodyParser runs first
    await parser(ctx, async ()=>{});
    const body = ctx.request.body;

    // Make sure no more parts to path
    if (pathParts[2]) {
      ctx.throw(HttpStatus.BAD_REQUEST, 'Too many parts to path');
    }

    // todo... handle the where, limit, skip, order, fields
    // const filter = '';
    
    console.log(`${method} request`); // need better logging

    switch (method) {
      case 'GET': {
        // Get record using id (if specified) and filter (if specified)
        const db = await connectToDb(dbName);
        const query = documentId ? { _id: ObjectID(documentId) } : {};        
        const result = await db.collection(collectionName).find(query).toArray()
        ctx.body = result;

        break;
      }      
      case 'POST': {
        // Perform database insert, single or multiple records

        const db = await connectToDb(dbName);

        if (Array.isArray(body)) {
          const result = await db.collection(collectionName).insertMany(body);
          ctx.body = result.ops;  
        } else {
          const result = await db.collection(collectionName).insertOne(body);
          ctx.body = result.ops;  
        }

        break;
      }
      case 'PUT': {
        // Effectively an upsert - update or else insert - ID must be present - https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6
        if (!documentId) {
          ctx.throw(HttpStatus.BAD_REQUEST, 'Document not specified');
        }

        const db = await connectToDb(dbName);
        const query = { _id: ObjectID(documentId) };        
        const result = await db.collection(collectionName).updateOne(query, {$set: body}, { upsert: true });
        ctx.body = result;

        break;
      }
      case 'DELETE': {
        // currently only support delete individual and no where parameter allowed
        const db = await connectToDb(dbName);

        if (!documentId) {
          ctx.throw(HttpStatus.BAD_REQUEST, 'Document not specified');
        }

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
