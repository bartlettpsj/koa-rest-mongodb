#! /usr/bin/env node

// Configuration
const port = process.argv[2] || 3000;
const endpoint = process.argv[3] || 'other';

const app = new (require('koa'))();
const router = new (require('koa-router'))({prefix: `/${endpoint}`});
const mount = require('koa-mount');
const restMongo = require('./koa-rest-mongodb');

// Random router stuff
router.get('/data/:id', async (ctx, next) => { ctx.body = { greeting: `got data - ${ctx.params.id}` } });
router.get('/', async (ctx, next) => { ctx.body = { greeting: "hello world!" } });

app
  .use(router.routes())
  .use(mount('/api', restMongo({db: 'test'})))
  .listen(port);

console.log(`Koa listening at http://localhost:${port}/${endpoint}`);