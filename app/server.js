import axios from 'axios';

const askGPT = async (prompt) => {
  const API_KEY = 'sk-eTMEVcH1WzLgNtK6GqbEbCwmINvPE6Wr7-nVQMPx0wT3BlbkFJWXcohgCC3fjgxG5N0NcEGsfNulUeBg2d3F-kHQPpwA';
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'Bearer',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'app/server',
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Erreur lors de la requête GPT :', error.response ? error.response.data : error.message);
    return `Désolé, une erreur est survenue : ${error.message}`;
  }
};

export default askGPT;

