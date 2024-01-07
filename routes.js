const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

async function sendToChatGPT(req, res) {
  try {
    const { transcription, history, voiceName, userName } = req.body;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo-1106',
        messages: [
          {
            role: 'system',
            content: `Your name is ${voiceName}. Respond in two parts with  pipe that separate.
            Act as a spoken English teacher. If my sentence is not correct, tell me strictly. Correct me accurately within 50 words.
            Feel free to initiate with a question first. 
            provide a sentence for me to respond to, After '|'.
            Just in case the username is ${userName}
            Remember to structure your response in two parts like this "enswer |suggestion".`,
          },
          { role: 'assistant', content: `${history}` },
          { role: 'user', content: ` ${transcription}` },
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

    // Call streamAudio function
    const chatGPTResponse = response.data.choices[0].message.content;
    const firstPart = chatGPTResponse.split('|')[0];
    const blobResponse = await streamAudio({ input: firstPart, voice: voiceName });

    // Return both ChatGPT response and audio response
    res.json({ chatGPTResponse, blobResponse });
  } catch (error) {
    console.error('Error sending transcription to ChatGPT:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
}

async function streamAudio({ input, voice }) {
  try {
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
    return blob;
  } catch (error) {
    console.error('Error streaming audio:', error);
    throw new Error('An error occurred while streaming audio.');
  }
}

module.exports = {
  sendToChatGPT,
  streamAudio,
};
