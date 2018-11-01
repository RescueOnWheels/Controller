/* Dependencies */
const isRoot = require('is-root');

/* Require elevated permission */
if (!isRoot()) {
  // eslint-disable-next-line no-console
  console.error('You are not allowed to run this app with root permissions.');
  process.exit(1);
}

module.exports = require('./lib/controller');
