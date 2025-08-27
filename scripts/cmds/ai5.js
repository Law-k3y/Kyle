const axios = require('axios');

const API_URL = 'https://messie-flash-api-ia.vercel.app/chat?prompt=';
const API_KEY = 'messie12356osango2025jinWoo';

async function getAIResponse(input) {
    try {
        const response = await axios.get(`${API_URL}${encodeURIComponent(input)}&apiKey=${API_KEY}`, {
            timeout: 10000,
            headers: { 'Accept': 'application/json' }
        });

        if (response.data?.parts?.[0]?.reponse) return response.data.parts[0].reponse;
        if (response.data?.response) return response.data.response;
        return "Désolé, réponse non reconnue de l'API";
    } catch (error) {
        console.error("API Error:", error.response?.status, error.message);
        return "Erreur de connexion au serveur IA";
    }
}

function toBoldFont(text) {
    const offsetUpper = 0x1D400 - 65;
    const offsetLower = 0x1D41A - 97; 

    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code + offsetUpper);
        if (code >= 97 && code <= 122) return String.fromCodePoint(code + offsetLower);
        return char;
    }).join('');
}

function formatResponse(content) {
    const styled = toBoldFont(content);
    return `${styled}`;}

module.exports = {
    config: {
        name: 'ai',
        author: 'Messie Osango',
        version: '2.0',
        role: 0,
        category: 'AI',
        shortDescription: 'IA intelligente',
        longDescription: 'Une IA capable de répondre à diverses questions et demandes.',
        keywords: ['ai']
    },
    onStart: async function({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) return api.sendMessage(formatResponse("hello there, how can i help ?"), event.threadID);

        try {
            const res = await getAIResponse(input);
            api.sendMessage(formatResponse(res), event.threadID, event.messageID);
        } catch {
            api.sendMessage(formatResponse("🎯 Response error"), event.threadID);
        }
    },
    onChat: async function({ event, message }) {
        const triggers = ['ai'];
        const body = event.body.toLowerCase();
        if (!triggers.some(t => body.startsWith(t))) return;

        const input = body.slice(body.split(' ')[0].length).trim();
        if (!input) return message.reply(formatResponse("🫡 Hello,  how may i help you sir!?"));

        try {
            const res = await getAIResponse(input);
            message.reply(formatResponse(res));
        } catch {
            message.reply(formatResponse("Server error sir!, Try later"));
        }
    }
};
