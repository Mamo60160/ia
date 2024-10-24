import axios from 'axios';

const askGPT = async (userPrompt) => {
  const API_KEY = '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';

  const ecoFriendlyPrompt = `
    Tu es un assistant virtuel écoresponsable. Pour chaque réponse, concentre-toi sur des solutions durables et respectueuses de l'environnement. 
    Voici ma question : ${userPrompt}. 
    Merci de prioriser des conseils qui :
    1. Réduisent l'empreinte carbone,
    2. Encouragent l'utilisation des transports écologiques (comme le vélo ou le train),
    3. Proposent des destinations qui privilégient la nature et la durabilité,
    4. Favorisent les pratiques de voyage responsables, comme le respect des cultures locales et la réduction des déchets.
    5. Tu peut aussi dire l'empreinte carbone de chaque moyen de transport. 
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: ecoFriendlyPrompt }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erreur lors de la requête GPT :', error.response ? error.response.data : error.message);
    return `Désolé, une erreur est survenue : ${error.message}`;
  }
};

export default askGPT;
