const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { sendToChatGPTAndAudio, chatGPTSuggestion } = require('./routes');


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/sendToChatGPTAndAudio', sendToChatGPTAndAudio);
app.post('/chatGPTSuggestion', chatGPTSuggestion);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
