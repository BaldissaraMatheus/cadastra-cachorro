/* For running on real server
if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongoURI from mLab'};
} else {
  */
  module.exports = {mongoURI: 'mongodb://localhost/fumaca_db'};
/*
}
*/