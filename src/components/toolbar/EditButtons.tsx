import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Scissors } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface EditButtonsProps {
  onDelete: () => void;
}

const EditButtons = ({ onDelete }: EditButtonsProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      const selection = document.getSelection();
      const text = selection?.toString() || '';
      await navigator.clipboard.writeText(text);
      toast({
        title: "Texto copiado",
        description: "El texto seleccionado ha sido copiado al portapapeles.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el texto. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleCut = () => {
    try {
      document.execCommand('cut');
      toast({
        title: "Texto cortado",
        description: "El texto seleccionado ha sido cortado al portapapeles.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cortar el texto. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button variant="outline" size="icon" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleCut}>
        <Scissors className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4 text-foreground" />
      </Button>
    </>
  );
};

export default EditButtons;