import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  List, 
  Heading1, 
  Heading2, 
  Heading3,
  Copy,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  FileDown
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';

interface EditorToolbarProps {
  formatText: (command: string, value?: string) => void;
}

const EditorToolbar = ({ formatText }: EditorToolbarProps) => {
  const { toast } = useToast();
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60, 72, 96, 120];

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

  const handleDelete = () => {
    document.execCommand('delete', false);
  };

  const handleFontSize = (size: string) => {
    formatText('fontSize', size);
  };

  const handleExportPDF = () => {
    const element = document.querySelector('.editor-content');
    if (!element) {
      toast({
        title: "Error",
        description: "No se encontró contenido para exportar.",
        variant: "destructive",
      });
      return;
    }

    const opt = {
      margin: 1,
      filename: 'documento.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      toast({
        title: "PDF generado",
        description: "El documento se ha exportado exitosamente.",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="border-b border-border p-4">
      <div className="flex space-x-2">
        <Button variant="outline" size="icon" onClick={() => formatText('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => formatText('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => formatText('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => formatText('formatBlock', 'h1')}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => formatText('formatBlock', 'h2')}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => formatText('formatBlock', 'h3')}>
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 text-foreground" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => formatText('justifyLeft')}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => formatText('justifyCenter')}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => formatText('justifyFull')}>
          <AlignJustify className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => document.execCommand('undo')}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => document.execCommand('redo')}>
          <Redo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleExportPDF}>
          <FileDown className="h-4 w-4" />
        </Button>
        <Select onValueChange={handleFontSize} defaultValue="12">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="11 puntos" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EditorToolbar;