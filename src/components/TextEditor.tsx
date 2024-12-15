import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Type, Undo, Redo, Bold, Italic, List, Heading, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const TextEditor = () => {
  const [isListening, setIsListening] = useState(false);
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isPromptListening, setIsPromptListening] = useState(false);
  const { toast } = useToast();
  const recognition = useRef<SpeechRecognition | null>(null);
  const promptRecognition = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = (isPrompt: boolean) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (isPrompt) {
          setPrompt(transcript);
        } else {
          setContent(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "Hubo un error con el reconocimiento de voz.",
          variant: "destructive",
        });
      };

      return recognition;
    }
    return null;
  };

  const toggleListening = (isPrompt: boolean) => {
    if (isPrompt) {
      if (!promptRecognition.current) {
        promptRecognition.current = initializeSpeechRecognition(true);
      }
      
      if (isPromptListening) {
        promptRecognition.current?.stop();
      } else {
        promptRecognition.current?.start();
      }
      setIsPromptListening(!isPromptListening);
    } else {
      if (!recognition.current) {
        recognition.current = initializeSpeechRecognition(false);
      }
      
      if (isListening) {
        recognition.current?.stop();
      } else {
        recognition.current?.start();
      }
      setIsListening(!isListening);
    }
  };

  const generateText = async () => {
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
              content: "You are a writing assistant. Format your responses with proper paragraph spacing, separating each paragraph with a blank line."
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
        // Formatear el texto con párrafos separados
        const formattedText = data.choices[0].message.content
          .split('\n\n')
          .map(paragraph => `<p class="mb-4">${paragraph.trim()}</p>`)
          .join('');
        setContent(formattedText);
      }
    } catch (error) {
      console.error('Error generating text:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el texto. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const clearText = () => {
    setContent('');
    toast({
      title: "Texto borrado",
      description: "El contenido ha sido eliminado.",
    });
  };

  const formatText = (command: string) => {
    document.execCommand(command, false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Column - Prompt */}
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
          <Button variant="destructive" size="icon" onClick={clearText}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right Column - Editor */}
      <div className="flex-1 flex flex-col">
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
            <Button variant="outline" size="icon" onClick={() => formatText('formatBlock')}>
              <Heading className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => document.execCommand('undo')}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => document.execCommand('redo')}>
              <Redo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleListening(false)}
              className={isListening ? "bg-primary text-primary-foreground" : ""}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div
          className="flex-grow p-4 editor-content [&>p]:mb-4"
          contentEditable
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
};

export default TextEditor;