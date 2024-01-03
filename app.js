const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai'); // Use the OpenAI npm package
const app = express();
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const port =  process.env.PORT || "http://localhost:3001"; // You can choose any available port


app.use(cors());
app.use(bodyParser.json());
app.post('/api/sendToChatGPT', async (req, res) => {
  try {
    const { transcription, voiceName, userName } = req.body;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: `"Your name is ${voiceName}. Respond in two parts with separate pipes.
                Act as a spoken English teacher. if my sentence is not correct, correcting me strictly  Correct me accurately within 50 words.
                if is correct just answer.
                Begin with a question. Feel free to initiate with a question first. 
                After '|', provide a sentence for me to respond to.
                Remember to structure your response in two parts."`,
              },
              { role: 'user', content:`My name is ${userName} ${transcription}` },
        ],
        temperature: 0.7,
        max_tokens: 250,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const chatGPTResponse = response.data.choices[0].message.content;
    res.json({ chatGPTResponse });
  } catch (error) {
    console.error('Error sending transcription to ChatGPT:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

app.post('/api/streamAudio', async (req, res) => {
  try {
    const { input, voice } = req.body;
    const apiUrl = 'https://api.openai.com/v1/audio/speech';

    const response = await axios.post(apiUrl, {
      model: 'tts-1',
      voice,
      input,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      responseType: 'arraybuffer',
    });

    const blob = await response.data;
    res.send(blob);
  } catch (error) {
    console.error('Error streaming audio:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

