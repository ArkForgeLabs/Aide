import { useState, useEffect } from 'react'
import './App.css'
import Mascot from './components/Mascot'
import { ThemeSelector } from './components/ThemeSelector'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import './components/Mascot.css'

type Feature = 'weather' | 'summary' | 'email' | 'general';

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

// Api key
const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
  console.warn('Missing API key');
}

const AppContent = () => {
  const { theme } = useTheme();
  const [input, setInput] = useState('')
  const [mascotMood, setMascotMood] = useState<'idle' | 'thinking' | 'happy' | 'confused'>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [activeFeature, setActiveFeature] = useState<Feature>('general')

  // Update Css var
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--surface', theme.surface);
    document.documentElement.style.setProperty('--text', theme.text);
    document.documentElement.style.setProperty('--text-secondary', theme.textSecondary);
  }, [theme]);

  const getWeather = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        return `Weather in ${data.name}:
Temperature: ${Math.round(data.main.temp)}°C
Feels like: ${Math.round(data.main.feels_like)}°C
Weather: ${data.weather[0].description}
Humidity: ${data.main.humidity}%`;
      } else {
        return "Sorry, I couldn't find weather information for that city. Please try another city name.";
      }
    } catch (error) {
      console.error('Weather API error:', error);
      return "Sorry, I couldn't fetch the weather information at the moment. Please try again later.";
    }
  };

  const summarizeText = async (text: string) => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `Please summarize the following text in a concise way:\n\n${text}`,
          stream: false,
        }),
      });
      const data = await response.json();
      return data.response || "Sorry, I couldn't generate a summary at the moment.";
    } catch (error) {
      console.error('Llama API error:', error);
      return "Sorry, I couldn't connect to the Llama API. Make sure it's running locally.";
    }
  };

  const generateEmail = async (purpose: string) => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `Write a professional email for the following purpose:\n\n${purpose}`,
          stream: false,
        }),
      });
      const data = await response.json();
      return data.response || "Sorry, I couldn't generate an email at the moment.";
    } catch (error) {
      console.error('Llama API error:', error);
      return "Sorry, I couldn't connect to the Llama API. Make sure it's running locally.";
    }
  };

  const detectFeature = (input: string): Feature => {
    const text = input.toLowerCase();
    if (text.includes('weather')) return 'weather';
    if (text.includes('summarize') || text.includes('summary')) return 'summary';
    if (text.includes('email') || text.includes('mail')) return 'email';
    return 'general';
  };

  const processInput = async (input: string, feature: Feature) => {
    switch (feature) {
      case 'weather':
        if (input.toLowerCase().includes('weather in ')) {
          const city = input.toLowerCase().split('weather in ')[1].trim();
          return await getWeather(city);
        }
        return "Which city's weather would you like to know about? (e.g., 'Weather in London')";
      
      case 'summary':
        if (input.toLowerCase().startsWith('summarize:')) {
          const text = input.slice(10).trim();
          return await summarizeText(text);
        }
        return "Please provide the text to summarize starting with 'Summarize:' followed by your text.";
      
      case 'email':
        if (input.toLowerCase().startsWith('email:')) {
          const purpose = input.slice(6).trim();
          return await generateEmail(purpose);
        }
        return "Please describe the purpose of your email starting with 'Email:' followed by your description.";
      
      default:
        if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
          return getInitialPrompt();
        }
        return "I can help with weather updates, text summarization, and email writing. What would you like to do?";
    }
  };

  const getInitialPrompt = () => {
    return "Hi! I'm Aide, your AI assistant. I can help you with:\n" +
           "🌤️ Weather information (try 'Weather in London')\n" +
           "📝 Text summarization (try 'Summarize: your text here')\n" +
           "✉️ Email writing (try 'Email: schedule a meeting')\n" +
           "Just let me know what you'd like help with!";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    


    setMascotMood('thinking');

    

    const feature = detectFeature(input);
    setActiveFeature(feature);
    
    const response = await processInput(input, feature);
    
    setMessages(prev => [...prev, { 
      type: 'assistant', 
      content: response
    }]);
    setMascotMood('happy');
    
    setInput('');
  };

  return (
    <div className="app-container">
      <ThemeSelector />
      
      <header className="app-header">
        <h1>Aide</h1>
        <p className="subtitle">Your Friendly AI Assistant</p>
      </header>
      
      <div className="feature-indicators">
        <div className={`feature-badge ${activeFeature === 'weather' ? 'active' : ''}`}>🌤️ Weather</div>
        <div className={`feature-badge ${activeFeature === 'summary' ? 'active' : ''}`}>📝 Summary</div>
        <div className={`feature-badge ${activeFeature === 'email' ? 'active' : ''}`}>✉️ Email</div>
      </div>

      <div className="mascot-container">
        <Mascot mood={mascotMood} />
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            {getInitialPrompt()}
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about weather, summarize text, or write emails..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
