// setup config.js wich includes client_ID, client_secret and JWT password
try {
  var config = require('../config.js');
}
catch (e) {
  console.log('did not load config file');
  console.log(e);
}

// set beats API variables
exports.Beats = {
  authorize: 'https://partner.api.beatsmusic.com/v1/oauth2/authorize',
  requestToken: 'https://partner.api.beatsmusic.com/oauth2/token',
  client_id: config.KEY,
  client_secret: config.SECRET,
  redirect_uri: 'http://localhost:3000/auth/beatsmusic/callback',
  api: 'https://partner.api.beatsmusic.com/v1',
  me: '/api/me',
  genres: '/api/genres',
};

// set JWT password
exports.jwt = {
  secret: config.JWTSECRET
};
