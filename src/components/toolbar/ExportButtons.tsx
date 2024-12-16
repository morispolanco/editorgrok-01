import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, Book, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';

const ExportButtons = () => {
  const { toast } = useToast();

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

  const handleExportEbook = () => {
    const element = document.querySelector('.editor-content');
    if (!element) {
      toast({
        title: "Error",
        description: "No se encontró contenido para exportar.",
        variant: "destructive",
      });
      return;
    }

    const content = element.innerHTML;
    const blob = new Blob([content], { type: 'application/epub+zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.epub';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Ebook generado",
      description: "El documento se ha exportado en formato ebook exitosamente.",
    });
  };

  const handleExportWord = () => {
    const element = document.querySelector('.editor-content');
    if (!element) {
      toast({
        title: "Error",
        description: "No se encontró contenido para exportar.",
        variant: "destructive",
      });
      return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = element.innerHTML;

    const paragraphs = tempDiv.getElementsByTagName('p');
    Array.from(paragraphs).forEach(p => {
      p.replaceWith(p.textContent + '\n\n');
    });

    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    Array.from(headings).forEach(h => {
      h.replaceWith('\n' + h.textContent + '\n\n');
    });

    const lists = tempDiv.querySelectorAll('ul, ol');
    Array.from(lists).forEach(list => {
      const items = Array.from(list.getElementsByTagName('li'))
        .map(li => '• ' + li.textContent)
        .join('\n');
      list.replaceWith('\n' + items + '\n\n');
    });

    let plainText = tempDiv.textContent || '';
    plainText = plainText.replace(/<[^>]*>/g, '');
    plainText = plainText.replace(/\n{3,}/g, '\n\n');

    const blob = new Blob([plainText], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Word generado",
      description: "El documento se ha exportado en formato Word exitosamente.",
    });
  };

  return (
    <>
      <Button variant="outline" size="icon" onClick={handleExportPDF}>
        <FileDown className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleExportEbook}>
        <Book className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleExportWord}>
        <FileText className="h-4 w-4" />
      </Button>
    </>
  );
};

export default ExportButtons;