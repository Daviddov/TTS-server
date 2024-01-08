const axios = require('axios');

async function streamAudio({ input, voice ,apiKey}) {
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
    streamAudio,
  };