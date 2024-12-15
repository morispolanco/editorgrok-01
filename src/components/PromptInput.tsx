import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import PromptButtons from './prompt/PromptButtons';
import { useVoiceRecognition } from './prompt/VoiceRecognition';
import { generateImage } from '@/services/togetherService';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  generateText: () => void;
}

const PromptInput = ({ 
  prompt, 
  setPrompt, 
  generateText 
}: PromptInputProps) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const { startListening, stopListening } = useVoiceRecognition(setPrompt);

  const handleToggleMic = () => {
    if (isListening) {
      stopListening(recognition);
      setIsListening(false);
      setRecognition(null);
    } else {
      const newRecognition = startListening();
      if (newRecognition) {
        setRecognition(newRecognition);
        setIsListening(true);
      }
    }
  };

  const handleClearPrompt = () => {
    setPrompt('');
    toast({
      title: "Prompt borrado",
      description: "El prompt ha sido eliminado.",
    });
  };

  const handleImprovePrompt = async () => {
    try {
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
              content: "You are a prompt engineer. Your task is to improve the given prompt to make it more specific, clear, and effective. Keep the improved prompt in Spanish."
            },
            {
              role: "user",
              content: `Por favor, mejora este prompt: ${prompt}`
            }
          ],
          model: "grok-2-1212",
          stream: false,
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setPrompt(data.choices[0].message.content);
        toast({
          title: "Prompt mejorado",
          description: "El prompt ha sido mejorado exitosamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo mejorar el prompt. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingrese un prompt antes de generar una imagen.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const result = await generateImage({ prompt });
      
      toast({
        title: "Imagen generada",
        description: "La imagen se ha generado exitosamente.",
      });

      console.log("Imagen generada:", result);
      
    } catch (error) {
      console.error("Error generando imagen:", error);
      toast({
        title: "Error",
        description: "No se pudo generar la imagen. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="w-1/4 border-r border-border p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Prompt</h2>
      </div>
      <textarea
        className="flex-grow p-4 rounded-md border border-input bg-background resize-none mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ingrese su prompt aquí..."
      />
      <PromptButtons
        isListening={isListening}
        isGeneratingImage={isGeneratingImage}
        onGenerate={generateText}
        onImprove={handleImprovePrompt}
        onGenerateImage={handleGenerateImage}
        onToggleMic={handleToggleMic}
        onClear={handleClearPrompt}
      />
    </div>
  );
};

export default PromptInput;