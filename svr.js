const express = require('express');
const app = express();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const pjson = require('./lib/environ');
const colors = require('colors');
const computeRoute = require('./routes/compute-route');
const RateLimit = require('express-rate-limit');
const limiter = new RateLimit({ windowMs: 1 * 60 * 1000, max: 100, delayMs: 0 });
const cors = require('cors');
var fs = require('fs');

app.use(cors(pjson.setts.cors));
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/compute', computeRoute);

if (cluster.isMaster && !pjson.setts.forceDev) {
  console.log(`Master ${process.pid} is running`.yellow);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`.red);
  });
} else {

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  console.log(`Worker ${process.pid} started`.yellow);

  //JSHEFER (ideally we would not store our errors this way and would send to ELK stack via winston)
  process.on('unhandledRejection', (reason, p) => {
    fs.writeFile('./log/errors.txt', reason, function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });
}


module.exports.app = app;