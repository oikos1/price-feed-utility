const R      = require('ramda');
const lib    = require('../lib/common');
const block  = require('../libexec/block');
const gov    = require('../libexec/gov');
const cup    = require('../libexec/cup');
const newCup = require('../libexec/new-cup');
const step   = 5000;

if(process.env.BLOCK) {
  console.log("Re-syncing cached blocks...");
  block.syncFrom(process.env.BLOCK);
} else {
  console.log("Syncing missing blocks...");
  block.syncMissing();
}

lib.latestBlock
.then(latest => {
  console.log("Syncing cups, new cups, gov...");
  batchSync(lib.genBlock, latest);
})
.catch(e => console.log(e));


const batchSync = (earliest, latest) => {
  const batches = (to, arr=[]) => {
    arr.push({from: to-step, to: to })
    if(to < earliest-step)
      return arr;
    else
      return batches(to-step, arr);
  }
  require('bluebird').map(batches(latest), (o) => {
    return execSync(o.from, o.to);
  }, {concurrency: 1})
  .then(() => console.log("batchSync complete"));
}

const execSync = (from, to) => {
  return gov.sync(from, to)
  .then(() => cup.sync(from, to))
  .then(() => newCup.sync(from, to))
  .catch(e => console.log(e));
}
