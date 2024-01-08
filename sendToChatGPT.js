const axios = require('axios');

async function sendToChatGPT(parameters, apiKey) {
    try {
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const {model,messages,temperature, max_tokens} = parameters;
      const response = await axios.post(apiUrl,   
        {
            model,
            messages,
            temperature,
            max_tokens,
          }
          , {
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
  module.exports = {
    sendToChatGPT,
  };
  