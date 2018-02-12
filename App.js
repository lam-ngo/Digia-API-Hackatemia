const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

//USE IBM WATSON TONE ANALYZER LIBRARY
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const tone_analyzer = new ToneAnalyzerV3({
  username: '47e7648f-3796-41da-93be-ff64fafa7b81',
  password: 'muqL70UErLlZ',
  version_date: '2018-02-12'
});

//GET REQUEST HANDLER TO ANALYZING TEST DATA
app.get('/get', function(req, res){
  console.log('GET request!');

  var params = {
    'tone_input': require('./data_test/tone.json'),
    'content_type': 'application/json'
  };

  tone_analyzer.tone(params, function(error, response) {
    if (error)
      res.send("Error: " + error);
    else
      res.send(JSON.stringify(response, null, 2));
    }
  );
});

//POST REQUEST HANDLER FOR ANALYZING USER INPUT DATA
app.post('/post', function(req, res) {
  console.log(req.body);

  var params = {
    'tone_input': req.body,
    'content_type': 'application/json'
  };

  tone_analyzer.tone(params, function(error, response) {
    if (error)
      res.send(error);
    else
      res.send(JSON.stringify(response, null, 2));
    }
  );
})

app.listen(3005);
