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

app.listen(3005);
