const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

//USE IBM WATSON SPEECH TO TEXT LIBRARY
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');

const speechToText = new SpeechToTextV1({
  username: '15983ad1-eeff-4d76-8ee6-099078ea7995',
  password: 'oJTqqceoksvR',
  url: 'https://stream.watsonplatform.net/speech-to-text/api/'
});

const getText = function(path, res){
  console.log('Speech to text from path: ' + path);

  var params = {
    // From file
    audio: fs.createReadStream(path),
    content_type: 'audio/flac'
  };

  speechToText.recognize(params, function(error, response) {
    if (error)
      res.send(error);
    else
      res.send(JSON.stringify(response, null, 2));
  });
}

//GET REQUEST HANDLER FOR TONE
app.get('/get/tone/houseburning', function(req, res){
  console.log('GET request!');
  getText('data_test/houseburning.flac', res);
});

app.get('/get/tone/manwithgun', function(req, res){
  console.log('GET request!');
  getText('data_test/manwithgun.flac', res);
});


app.listen(3005);
