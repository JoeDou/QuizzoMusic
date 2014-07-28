try {
  var config = require('../config.js');
}
catch (e) {
  console.log('did not load config file');
  console.log(e);
}

exports.Beats = {
  authorize: 'https://partner.api.beatsmusic.com/v1/oauth2/authorize',
  requestToken: 'https://partner.api.beatsmusic.com/oauth2/token',
  client_id: config.KEY,
  client_secret: config.SECRET,
  redirect_uri: 'http://localhost:3000/auth/beatsmusic/callback',
  api: 'https://partner.api.beatsmusic.com/v1/api'
};

exports.jwt = {
  secret: config.JWTSECRET
};
