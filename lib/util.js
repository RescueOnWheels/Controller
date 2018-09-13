/* eslint-disable no-mixed-operators */
module.exports = {
  map(from, to, s) {
    return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
  },
};
