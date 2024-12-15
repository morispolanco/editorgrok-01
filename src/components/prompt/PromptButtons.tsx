import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Wand2, Mic, MicOff, ImagePlus } from 'lucide-react';

interface PromptButtonsProps {
  isListening: boolean;
  isGeneratingImage: boolean;
  onGenerate: () => void;
  onImprove: () => void;
  onGenerateImage: () => void;
  onToggleMic: () => void;
  onClear: () => void;
}

const PromptButtons = ({
  isListening,
  isGeneratingImage,
  onGenerate,
  onImprove,
  onGenerateImage,
  onToggleMic,
  onClear
}: PromptButtonsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button onClick={onGenerate} className="flex-1">
          Generar Texto
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onGenerateImage}
          disabled={isGeneratingImage}
          className="flex-1"
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Generar Imagen
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={onImprove}>
          <Wand2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onToggleMic}
          className={isListening ? "bg-red-500 hover:bg-red-600 text-white" : ""}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button variant="destructive" size="icon" onClick={onClear}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromptButtons;