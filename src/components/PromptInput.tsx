import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Trash2, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  isPromptListening: boolean;
  toggleListening: (isPrompt: boolean) => void;
  generateText: () => void;
}

const PromptInput = ({ 
  prompt, 
  setPrompt, 
  isPromptListening, 
  toggleListening, 
  generateText 
}: PromptInputProps) => {
  const { toast } = useToast();

  const clearPrompt = () => {
    setPrompt('');
    toast({
      title: "Prompt borrado",
      description: "El prompt ha sido eliminado.",
    });
  };

  const improvePrompt = async () => {
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

  return (
    <div className="w-1/3 border-r border-border p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Prompt</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleListening(true)}
          className={isPromptListening ? "bg-primary text-primary-foreground" : ""}
        >
          {isPromptListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
      <textarea
        className="flex-grow p-4 rounded-md border border-input bg-background resize-none mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ingrese su prompt aquí..."
      />
      <div className="flex gap-2">
        <Button onClick={generateText} className="flex-1">
          Generar Texto
        </Button>
        <Button variant="outline" size="icon" onClick={improvePrompt}>
          <Wand2 className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={clearPrompt}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;