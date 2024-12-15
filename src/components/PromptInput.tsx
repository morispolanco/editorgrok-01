import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Trash2 } from 'lucide-react';
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
        <Button variant="destructive" size="icon" onClick={clearPrompt}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;