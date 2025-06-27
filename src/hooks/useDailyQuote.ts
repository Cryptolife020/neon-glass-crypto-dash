
import { useState, useEffect } from 'react';

interface DailyQuote {
  quote: string;
  date: string;
  formattedDate: string;
}

const OPENROUTER_API_KEY = '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';
const STORAGE_KEY = 'daily_quote';

export const useDailyQuote = () => {
  const [quote, setQuote] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const getTodayDateBrazil = () => {
    const now = new Date();
    const brazilTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    return brazilTime.toDateString();
  };

  const getFormattedDateBrazil = () => {
    const now = new Date();
    const brazilTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    return brazilTime.toLocaleDateString('pt-BR');
  };

  const generateDailyQuote = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Crypto Dashboard",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-v3-base:free",
          "messages": [
            {
              "role": "user",
              "content": "Gere uma frase motivacional curta e inspiradora sobre sucesso, persistência ou trading/investimentos em português brasileiro. Máximo 100 caracteres, sem aspas no início e fim."
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar frase motivacional');
      }

      const data = await response.json();
      const generatedQuote = data.choices[0]?.message?.content?.trim() || '';
      
      if (generatedQuote) {
        const dailyQuote: DailyQuote = {
          quote: generatedQuote,
          date: getTodayDateBrazil(),
          formattedDate: getFormattedDateBrazil()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dailyQuote));
        setQuote(generatedQuote);
        setFormattedDate(dailyQuote.formattedDate);
      }
    } catch (err) {
      console.error('Erro ao gerar frase:', err);
      setError('Erro ao carregar frase do dia');
      // Frase fallback
      const fallbackQuote = 'O sucesso é a soma de pequenos esforços repetidos dia após dia.';
      setQuote(fallbackQuote);
      setFormattedDate(getFormattedDateBrazil());
    } finally {
      setLoading(false);
    }
  };

  const checkAndUpdateQuote = async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = getTodayDateBrazil();
    
    if (stored) {
      const dailyQuote: DailyQuote = JSON.parse(stored);
      
      if (dailyQuote.date === today) {
        // Frase já existe para hoje
        setQuote(dailyQuote.quote);
        setFormattedDate(dailyQuote.formattedDate || getFormattedDateBrazil());
        return;
      }
    }
    
    // Gerar nova frase para hoje
    await generateDailyQuote();
  };

  useEffect(() => {
    checkAndUpdateQuote();
  }, []);

  return { quote, formattedDate, loading, error, refreshQuote: generateDailyQuote };
};
