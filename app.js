const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const { sendToChatGPT, streamAudio } = require('./routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/sendToChatGPT', sendToChatGPT);
app.post('/api/streamAudio', streamAudio);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
