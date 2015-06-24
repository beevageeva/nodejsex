deployed on cloud heroku devcenter using mongo cloud database(mongolab): set in heroku dashboard variable MONGODB_URL (see config/databaseMongo.js) or DATABASE_URL for postgres
https://secure-badlands-6804.herokuapp.com/board
https://secure-badlands-6804.herokuapp.com/login
https://secure-badlands-6804.herokuapp.com/register


npm install (like bundle)



test app locally
/usr/local/share/gems/gems/foreman-0.78.0/bin/foreman start web


push local changes to heroku repo
git add .
git commit -m "Demo"
git push heroku master



../heroku-client/bin/heroku login
../heroku-client/bin/heroku open



create a database(postgres)
 ../heroku-client/bin/heroku addons:docs heroku-postgresql


https://devcenter.heroku.com/articles/getting-started-with-nodejs#view-logs

 ../heroku-client/bin/heroku restart
 ../heroku-client/bin/heroku logs --tail
 ../heroku-client/bin/heroku pg:psql
## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
