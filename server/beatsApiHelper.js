var request = require('request'); // require request for HTTP request service
var querystring = require('querystring'); //require querystring to url parsing
var constant= require('./constants.js'); // require constant.js for beats data
var jwt = require('jwt-simple'); // require json web token to package access token and user id

// First OAuth redirect to Beats Login page
exports.redirect = function(req, res){
  var url = constant.Beats.authorize + '?response_type=code'+
    '&redirect_uri=' + constant.Beats.redirect_uri +
    '&client_id='+ constant.Beats.client_id;
  // console.log('url', url);
  res.redirect(url);
};

// Second Oauth call after getting the authentication code
// will exchange code for access token and grab user ID
exports.requestToken = function(req,res){
  var data = querystring.parse(req.url);
  // if code exit from request url post for access token
  if (data.code){
    // create request object for access token
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
    // send HTTP request
    request(reqObj, function(error, data, body){
      // parse data object to get acess token
      var bodyData = JSON.parse(body);
      // console.log('JSON parse body', bodyData);

      // use access token to get user id
      userReqObj = {
        method: 'GET',
        url: constant.Beats.api + constant.Beats.me,
        headers: {
          Authorization: 'Bearer ' + bodyData.result.access_token
        }
      };

      // send HTTP request for user ID
      request(userReqObj, function(error, userData, userBody){
        var userBodyData = JSON.parse(userBody);
        
        // create payload for JWT
        var payload = {
          user_id: userBodyData.result.user_context,
          access_token: bodyData.result.access_token,
          refresh_token: bodyData.result.refresh_token,
        };
        // console.log('payload', payload);

        // encode
        var secret = constant.jwt.secret;
        var token = jwt.encode(payload, secret);

        // respond angular url with JWT attached
        res.redirect('/#/login/auth/' + token);
      });

    });
  }else{
    res.send(400,'bad request: no code');
  }
};

// Create questions for from Beats API
exports.createQuestions = function(req,res){
  // parse request for JWT which will include user ID and user access token
  var data = querystring.parse(req.url);
  // console.log('genre data', data.data);
  var token = req.headers['x-access-token'];
  if (!token) { // no token return to login
    res.redirect('/#/login/');
  } else {
    // create request object to beats API to get genre data
    var secret = constant.jwt.secret;
    var userData = jwt.decode(token, secret);
    var url = constant.Beats.api + constant.Beats.genres+'/' +
      data.data+'/featured?client_id=' + constant.Beats.client_id;

    genreObj = {
      method: 'GET',
      url: url,
    };
    // console.log('req obj', genreObj);
    
    // making the request to beats API
    request(genreObj, function(error, genreData, genreBody){

      // call parse function to parse data and generate data to be
      // returned to client
      var data = parseGenreData(JSON.parse(genreBody).data);

      // create response object to client
      // TODO: exposed client ID and access token (probably a better way to do this)
      var retObj = {
        clientId: constant.Beats.client_id,
        authentication: {
            access_token:userData.access_token,
            user_id:userData.user_id
          },
        data: data
      };

      // console.log('data',retObj);
      // repsonse to client call
      res.send(200,retObj);
    });

  }
};

// Parse data returned from beats api call
function parseGenreData(genreObj){
  var output = {};
  // randomly pick playlist returned from beats api
  var index = Math.floor(Math.random()*genreObj.length); // save the playlist index
  output['description'] = genreObj[index].name; // save playidst name
  var length = genreObj[index].refs.tracks.length; // save number of tracks in playlist
  // console.log('length', length);

  var questions = [];
  
  // loop 5 times to create 5 questions
  for (var i=0; i<5; i++){
    var question ={};
    // divid playlist into 5 sections and randomly draw in each section
    var trackNum = Math.floor((i + Math.random())*(length/5)); // store track number
    question['id'] = genreObj[index].refs.tracks[trackNum].id; // store track ID
    question['name'] = genreObj[index].refs.tracks[trackNum].display; // store name of the song
    question['wrong'] = []; //initialize array for wrong answers
    var start = Math.floor(Math.random()*length); //randomly pick a location in the playlist
    var offset = 0;
    // push the next 3 song titles in the array
    // TODO: This algorithm can be improved
    for (var j =0; j<3; j++){
      var qIndex = start+j+offset;
      if ((length-1) < qIndex){
        offset = j*(-1);
        qIndex = 0;
        start = 0;
      } else if(qIndex === trackNum){
        offset++;
        qIndex++;
      }
      // patch for undefined issues, need a better solution
      if (genreObj[index].refs.tracks[qIndex] === undefined){
        offset = j*(-1);
        qIndex = 0;
        start = 0;
      }

      question['wrong'].push(genreObj[index].refs.tracks[qIndex].display);
    }
    questions.push(question);
  }

  output['questions']= questions;

  // console.log('output', output);

  return output;
}
