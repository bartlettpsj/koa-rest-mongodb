#! /usr/bin/env node

// Configuration
const port = process.argv[2] || 3000;
const endpoint = process.argv[3] || 'other';

const mount = require('koa-mount');
const app = new (require('koa'))();
const router = new (require('koa-router'))({prefix: `/${endpoint}`});
const restMongo = require('./koa-rest-mongodb');
const schema = require('./schema');

// Random router stuff
router.get('/data/:id', async (ctx, next) => { ctx.body = { greeting: `got data - ${ctx.params.id}` } });
router.get('/', async (ctx, next) => { ctx.body = { greeting: "hello world!" } });

app
  .use(router.routes())
  .use(mount('/api', restMongo( { schema })))
  .listen(port);

console.log(`Koa listening at http://localhost:${port}/${endpoint}`);
