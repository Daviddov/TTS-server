const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

async function sendToChatGPTAndAudio(req, res) {
  try {
    const { transcription, history, voiceName, userName } = req.body;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const systemMessage = `Your name is ${voiceName}. Act as a spoken English teacher. If my sentence is not correct, Correct me accurately within max 50 words. Feel free to initiate with a question first. Just for the case, the username is ${userName}`;

    const parametersInitial = {
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'assistant', content: `${history}` },
        { role: 'user', content: ` ${transcription}` },
      ],
      temperature: 0.7,
      max_tokens: 200,
    };

    // Call sendToChatGPT function for initial chat completion
    const chatGPTResponse = await sendToChatGPT(parametersInitial);

    const parametersSuggestion = {
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: 'provide a sentence to respond to' },
        { role: 'user', content: ` ${chatGPTResponse}` },
      ],
      temperature: 0.7,
      max_tokens: 50,
    };

    // Call sendToChatGPT function for suggestion
    const chatGPTSuggestion = await sendToChatGPT(parametersSuggestion);

    // Call streamAudio function
    const blobResponse = await streamAudio({ input: chatGPTResponse, voice: voiceName });

    // Return both ChatGPT response and audio response
    res.json({ chatGPTResponse, blobResponse, chatGPTSuggestion });
  } catch (error) {
    console.error('Error sending transcription to ChatGPT and streaming audio:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
}

async function sendToChatGPT(parameters) {
  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await axios.post(apiUrl, parameters, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending transcription to ChatGPT:', error);
    throw new Error('An error occurred while sending transcription to ChatGPT.');
  }
}

async function streamAudio({ input, voice }) {
  try {
    const apiUrl = 'https://api.openai.com/v1/audio/speech';

    const response = await axios.post(
      apiUrl,
      {
        model: 'tts-1',
        voice,
        input,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        responseType: 'arraybuffer',
      }
    );

    const blob = await response.data;
    return blob;
  } catch (error) {
    console.error('Error streaming audio:', error);
    throw new Error('An error occurred while streaming audio.');
  }
}

module.exports = {
  sendToChatGPTAndAudio,
  sendToChatGPT,
  streamAudio,
};
