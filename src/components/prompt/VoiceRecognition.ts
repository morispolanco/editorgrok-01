import { useToast } from "@/hooks/use-toast";

export const useVoiceRecognition = (
  onTranscript: (text: string) => void,
  onAutoStop: () => void
) => {
  const { toast } = useToast();
  let silenceTimer: NodeJS.Timeout;
  let lastCorrection = 0;
  const CORRECTION_INTERVAL = 5000; // Mínimo 5 segundos entre correcciones

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const correctText = async (text: string, retryCount = 0): Promise<string> => {
    try {
      // Verificar el tiempo desde la última corrección
      const now = Date.now();
      const timeSinceLastCorrection = now - lastCorrection;
      if (timeSinceLastCorrection < CORRECTION_INTERVAL) {
        console.log('Demasiado pronto para otra corrección, devolviendo texto original');
        return text;
      }

      // Si ya hemos intentado 3 veces, devolvemos el texto original
      if (retryCount >= 3) {
        console.log('Máximo número de reintentos alcanzado, devolviendo texto original');
        return text;
      }

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xai-uoMvikQBNFsDmXOqZh3MFfstiR8RXhTLDjdNaXrcUQUOkAyKfO0CfnPDklfnQh2VC2aGAl0ltJZd4Aio'
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "Eres un corrector de texto. Tu tarea es corregir la ortografía y mejorar la sintaxis del texto proporcionado, manteniendo el significado original. Solo devuelve el texto corregido, sin explicaciones adicionales."
            },
            {
              role: "user",
              content: text
            }
          ],
          model: "grok-2-1212",
          stream: false,
          temperature: 0.3
        })
      });

      if (response.status === 429) {
        console.log(`Intento ${retryCount + 1}: Rate limit alcanzado, esperando antes de reintentar...`);
        // Espera exponencial: 5^retryCount segundos (5, 25, 125 segundos)
        const waitTime = Math.pow(5, retryCount) * 1000;
        await delay(waitTime);
        return correctText(text, retryCount + 1);
      }

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        lastCorrection = Date.now(); // Actualizar el timestamp de la última corrección exitosa
        return data.choices[0].message.content;
      }
      return text;
    } catch (error) {
      console.error('Error corrigiendo texto:', error);
      if (retryCount < 3) {
        console.log(`Intento ${retryCount + 1}: Error en la petición, reintentando...`);
        const waitTime = Math.pow(5, retryCount) * 1000;
        await delay(waitTime);
        return correctText(text, retryCount + 1);
      }
      return text;
    }
  };

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = async (event) => {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }

        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        // Corregir el texto antes de enviarlo
        const correctedText = await correctText(transcript);
        onTranscript(correctedText);

        silenceTimer = setTimeout(() => {
          if (recognition) {
            recognition.stop();
            onAutoStop();
            toast({
              title: "Micrófono desactivado",
              description: "Se ha detectado 5 segundos de silencio.",
            });
          }
        }, 5000);
      };

      recognition.onend = () => {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
      };

      recognition.start();
      toast({
        title: "Micrófono activado",
        description: "Puedes empezar a hablar.",
      });

      return recognition;
    } else {
      toast({
        title: "Error",
        description: "Tu navegador no soporta el reconocimiento de voz.",
        variant: "destructive",
      });
      return null;
    }
  };

  const stopListening = (recognition: SpeechRecognition | null) => {
    if (recognition) {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      recognition.stop();
      toast({
        title: "Micrófono desactivado",
        description: "Has desactivado el micrófono.",
      });
    }
  };

  return { startListening, stopListening };
};