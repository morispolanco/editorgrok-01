import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import PromptInput from './PromptInput';
import EditorToolbar from './EditorToolbar';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';

const TextEditor = () => {
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const insertAtCursor = (text: string) => {
    const paragraphs = text.split('\n\n').map(p => p.trim()).filter(p => p.length > 0);
    const formattedText = paragraphs.map(p => `<p class="mb-4">${p}</p>`).join('');

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;
        
        range.deleteContents();
        const fragment = document.createDocumentFragment();
        Array.from(tempDiv.childNodes).forEach(node => {
          fragment.appendChild(node.cloneNode(true));
        });
        range.insertNode(fragment);
        range.collapse(false);
      } else if (editorRef.current) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;
        const fragment = document.createDocumentFragment();
        Array.from(tempDiv.childNodes).forEach(node => {
          fragment.appendChild(node.cloneNode(true));
        });
        editorRef.current.appendChild(fragment);
      }
    } else if (editorRef.current) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formattedText;
      const fragment = document.createDocumentFragment();
      Array.from(tempDiv.childNodes).forEach(node => {
        fragment.appendChild(node.cloneNode(true));
      });
      editorRef.current.appendChild(fragment);
    }
    
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };

  const insertImageAtCursor = (imageBase64: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        const img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${imageBase64}`;
        img.className = 'max-w-md rounded-lg shadow-lg mb-4';
        img.alt = 'Generated content';
        
        range.deleteContents();
        range.insertNode(img);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const generateText = async () => {
    setIsGeneratingText(true);
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
              content: "Eres un asistente de escritura. Genera texto plano sin formato markdown. Separa los párrafos con una línea en blanco."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          model: "grok-2-1212",
          stream: false,
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const formattedText = data.choices[0].message.content;
        insertAtCursor(formattedText);
        toast({
          title: "Texto generado",
          description: "El texto se ha generado exitosamente.",
        });
      }
    } catch (error) {
      console.error('Error generating text:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el texto. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingText(false);
    }
  };

  const formatText = (command: string, value?: string) => {
    if (command === 'formatBlock' && value) {
      document.execCommand(command, false, value);
    } else if (command === 'fontSize' && value) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = `${value}px`;
        range.surroundContents(span);
      }
    } else {
      document.execCommand(command, false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <PromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        generateText={generateText}
        setGeneratedImage={(image) => {
          if (image) {
            insertImageAtCursor(image);
          }
          setGeneratedImage(image);
        }}
      />
      
      <div className="flex-1 flex flex-col">
        <EditorToolbar
          formatText={formatText}
        />
        <div className="flex-grow p-4 pb-16">
          {isGeneratingText && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div
            ref={editorRef}
            className="editor-content [&>p]:mb-4 min-h-[200px] outline-none"
            contentEditable
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TextEditor;