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

const getTextForTone = function(path, res){
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
      toneAnalyze({text: JSON.stringify(response.results[0].alternatives[0].transcript)}, res);
  });
}

const getTextForQA = function(path, res){
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
      QA({question: response.results[0].alternatives[0].transcript}, res);
  });
}

//GET REQUEST HANDLER FOR TONE
app.get('/get/tone/houseburning', function(req, res){
  console.log('GET request for tone: houseburning');
  getTextForTone('data_test/houseburning.flac', res);
});

app.get('/get/tone/manwithgun', function(req, res){
  console.log('GET request for tone: manwithgun');
  getTextForTone('data_test/manwithgun.flac', res);
});

//GET REQUEST HANDLER FOR QA
app.get('/get/qa/houseburning', function(req, res){
  console.log('GET request for qa: houseburning');
  getTextForQA('data_test/houseburning.flac', res);
});

app.get('/get/qa/manwithgun', function(req, res){
  console.log('GET request for qa: manwithgun');
  getTextForQA('data_test/manwithgun.flac', res);
});

//USE IBM WATSON TONE ANALYZER LIBRARY
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const tone_analyzer = new ToneAnalyzerV3({
  username: '47e7648f-3796-41da-93be-ff64fafa7b81',
  password: 'muqL70UErLlZ',
  version_date: '2018-02-12'
});

const toneAnalyze = function(json, res){
  console.log('Analyzing tone');

  var params = {
    'tone_input': json,
    'content_type': 'application/json'
  };

  tone_analyzer.tone(params, function(error, response) {
    if (error)
      res.send(error);
    else
      res.send(JSON.stringify(response, null, 2));
    }
  );
};

//USE MICROSOFT QA MAKER
var request = require('request');

const QA = function(json, res){

  var options = {
    method: 'POST',
    url: 'https://westus.api.cognitive.microsoft.com/qnamaker/v1.0/knowledgebases/2062567b-201e-41cc-848e-79522cbbe4c0/generateAnswer',
    headers: {
      'Ocp-Apim-Subscription-Key': '931057a3c86c4a64a34ac15de9f1b2f9',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(json)
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.send(info);
    }
  }

  request(options, callback);
}

app.listen(3005);
