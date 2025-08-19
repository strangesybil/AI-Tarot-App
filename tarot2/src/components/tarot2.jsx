import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const tarotDeck = [
  { name: "The Fool", meaning:"New beginnings."  },
  { name: "The Magician", meaning:"Transformation and capability."  },
  { name: "The Empress", meaning:"Creation of life, romance, art." },
  { name: "The Emperor", meaning: "Stability and security."},
  { name: "The Hierophant", meaning:"The importance of tradition and convention." },
  { name: "The Lovers", meaning: "Choices, choices. What will you choose? " },
  { name: "The Chariot", meaning: "Go ahead card."},
  { name: "Justice", meaning: "If you have been wronged, the wheel is turning in your favor." },
  { name: "The Hermit", meaning: "Time to retreat to yourself. Reflect."},
  { name: "Wheel of Fortune", meaning: "The wheel always spins back!"},
  { name: "Strength", meaning: "A cycle of difficulty is complete."},
  { name: "The Hanged Man", meaning: "Pause."},
  { name: "Death", meaning: "A new cycle or phase is beginning." },
  { name: "Temperance", meaning: "Balance. Moderation."},
  { name: "The Devil", meaning: "Your shadows are chasing you."},
  { name: "The Tower", meaning: "Chaos. Danger. Liberation." },
  { name: "The Star", meaning: "Renewed hope and faith." },
  { name: "The Moon", meaning: "Something is not as it appears to be." },
  { name: "The Sun", meaning: "A time to sit back and enjoy." },
  { name: "Judgement", meaning: "A time of resurrection and awakening."},
  { name: "The World", meaning: "Change is coming. A new season has arrived."},
  { name: "The High Priestess", meaning: "Trust your instincts. Time for stilless."}
];


export default function Tarot() {
    const [response, setResponse] = useState("");
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState(""); 

    async function fetchTarot() {
        function drawCards(deck, count = 3) {
        const shuffled = [...deck].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    try{ 
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const cards = drawCards(tarotDeck, 3);
        const prompt = `You are a sarcastic and mean tarot reader. Use only prose. Do not emphasise any words. You should sound deadpan and rude. Make reference to the fact that you, the tarot reader are specifically drawing the cards. Interpret the following three cards for the user:
        The user asked: "${question}".
        1. ${cards[0].name} — ${cards[0].meaning}
        2. ${cards[1].name} — ${cards[1].meaning}
        3. ${cards[2].name} — ${cards[2].meaning}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        setResponse(text);
    }catch(err){
        setError(err.message);

    }
}

 return (
    <div className="container">
      <input 
        type="text"
        placeholder="Ask... if you dare."
        value={question}
        onChange={(e) => setQuestion(e.target.value)} // e is the event object, onChange runs whenever the user types in the input
        style={{ padding: "10px", borderRadius: "10px", width: "300px", marginBottom: "10px" }}
      />
      <button onClick={fetchTarot}></button> 
      {error && <p style={{color: "red"}}>{error}</p>}  
      {response && <div className="response">{response}</div>}
    </div>
  );


}