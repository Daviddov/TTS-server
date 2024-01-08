require('dotenv').config();
const { streamAudio } = require('./streamAudio');
const { sendToChatGPT } = require('./sendToChatGPT');

const apiKey = process.env.OPENAI_API_KEY;

async function sendToChatGPTAndAudio(req, res) {
  try {
    const { transcription, history, voiceName, userName } = req.body;

    const systemMessage = `Your name is ${voiceName}. Act as a spoken English teacher. 
    If my sentence is not correct, 
    Correct me within max 50 words. Feel free to initiate with a question first. 
    Just for the case, the username is ${userName}`;

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
    const chatGPTResponse = await sendToChatGPT(parametersInitial, apiKey);

    // Call streamAudio function

    const blobResponse = await streamAudio({ input: chatGPTResponse, voice: voiceName ,apiKey});


    // Return both ChatGPT response and audio response
    res.json({ chatGPTResponse, blobResponse });
  } catch (error) {
    console.error('Error sending transcription to ChatGPT and streaming audio:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
}

async function chatGPTSuggestion(req, res) {
  try {
    const { transcription } = req.body;
    const systemMessage = `give a Suggestion sentence to continue the conversation for me`;
    const parametersInitial = {
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: ` ${transcription}` },
      ],
      temperature: 0.7,
      max_tokens: 100,
    };

    // Call sendToChatGPT function for initial chat completion
    const chatGPTResponse = await sendToChatGPT(parametersInitial, apiKey);


    // Return both ChatGPT response and audio response
    res.json({ chatGPTResponse });
  } catch (error) {
    console.error('Error sending transcription to ChatGPT and streaming audio:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
}

module.exports = {
  sendToChatGPTAndAudio,
  chatGPTSuggestion,
};
