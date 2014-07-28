var request = require('request');
var querystring = require('querystring');
var constant= require('./constants.js');
var jwt = require('jwt-simple');


exports.redirect = function(req, res){
  var url = constant.Beats.authorize + '?response_type=code'+
    '&redirect_uri=' + constant.Beats.redirect_uri +
    '&client_id='+ constant.Beats.client_id;
  console.log('url', url);
  res.redirect(url);
};

exports.requestToken = function(req,res){
  var data = querystring.parse(req.url);
  console.log('parse url', data);
  if (data.code){

    var reqObj = {
      method: 'POST',
      url: constant.Beats.requestToken,
      form: {
        code: data.code,
        client_id: constant.Beats.client_id,
        client_secret: constant.Beats.client_secret,
        redirect_uri: constant.Beats.redirect_uri,
        grant_type: 'authorization_code'
      }
    };

    request(reqObj, function(error, data, body){
      //create JWT
      console.log('body', body);
      var bodyData = JSON.parse(body);
      console.log('JSON parse body', bodyData);

      userReqObj = {
        method: 'GET',
        url: constant.Beats.api + '/me',
        headers: {
          Authorization: 'Bearer ' + bodyData.result.access_token
        }
      };

      request(userReqObj, function(error, userData, userBody){
      
        var userBodyData = JSON.parse(userBody);
        console.log('body',userBodyData);

        var payload = {
          user_id: userBodyData.result.user_context,
          access_token: bodyData.result.access_token,
          refresh_token: bodyData.result.refresh_token,
        };
        console.log('payload', payload);

        var secret = constant.jwt.secret;
        console.log('secrert', secret);

        // encode
        var token = jwt.encode(payload, secret);
        console.log('token', token);

        res.redirect('/#/login/auth/' + token);
      });

    });
  }
};
