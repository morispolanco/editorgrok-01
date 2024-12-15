import { useToast } from "@/hooks/use-toast";

export const useVoiceRecognition = (onTranscript: (text: string) => void) => {
  const { toast } = useToast();

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        onTranscript(transcript);
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
      recognition.stop();
      toast({
        title: "Micrófono desactivado",
        description: "Se ha detenido la grabación.",
      });
    }
  };

  return { startListening, stopListening };
};