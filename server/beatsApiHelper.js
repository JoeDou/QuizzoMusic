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
        url: constant.Beats.api + constant.Beats.me,
        headers: {
          Authorization: 'Bearer ' + bodyData.result.access_token
        }
      };

      request(userReqObj, function(error, userData, userBody){
        var userBodyData = JSON.parse(userBody);

        var payload = {
          user_id: userBodyData.result.user_context,
          access_token: bodyData.result.access_token,
          refresh_token: bodyData.result.refresh_token,
        };
        // console.log('payload', payload);

        // encode
        var secret = constant.jwt.secret;
        var token = jwt.encode(payload, secret);
        res.redirect('/#/login/auth/' + token);
      });

    });
  }else{
    res.send(400,'no code');
  }
};

exports.createQuestions = function(req,res){
  var data = querystring.parse(req.url);
  console.log('genre data', data.data);
  var token = req.headers['x-access-token'];
  if (!token) {
    res.redirect('/#/login/');
  } else {
    var secret = constant.jwt.secret;
    var userData = jwt.decode(token, secret);
    var url = constant.Beats.api + constant.Beats.genres+'/' +
      data.data+'/featured?client_id=' + constant.Beats.client_id;

    genreObj = {
      method: 'GET',
      url: url,
    };
    console.log('req obj', genreObj);

    request(genreObj, function(error, genreData, genreBody){

      console.log('genre body', genreBody);
      var data = parseGenreData(JSON.parse(genreBody).data);

      var retObj = {
        clientId: constant.Beats.client_id,
        authentication: {
            access_token:userData.access_token,
            user_id:userData.user_id
          },
        data: data
      };

      console.log('data',retObj);
      res.send(200,retObj);

    });

  }
};

function parseGenreData(genreObj){
  var output = {};
  // console.log('parsed data', genreObj);
  var index = Math.floor(Math.random()*genreObj.length);
  // console.log('index', index);
  output['description'] = genreObj[index].description;
  var length = genreObj[index].refs.tracks.length;
  // console.log('length', length);

  var questions = [];

  for (var i=0; i<5; i++){
    var question ={};
    var trackNum = Math.floor((i + Math.random())*(length/5));
    question['id'] = genreObj[index].refs.tracks[trackNum].id;
    question['name'] = genreObj[index].refs.tracks[trackNum].display;
    question['wrong'] = [];
    var start = Math.floor(Math.random()*length);
    var offset = 0;
    for (var j =0; j<3; j++){
      var qIndex = start+j+offset;
      if (qIndex >= length){
        offset = j*-1;
        qIndex = 0;
        start = 0;
      } else if(qIndex === trackNum){
        offset++;
        qIndex++;
      }
      question['wrong'].push(genreObj[index].refs.tracks[qIndex].display);
    }
    questions.push(question);
  }

  output['questions']= questions;

  // console.log('output', output);

  return output;
}
