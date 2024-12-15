import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import PromptInput from './PromptInput';
import EditorToolbar from './EditorToolbar';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const TextEditor = () => {
  const [isListening, setIsListening] = useState(false);
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isPromptListening, setIsPromptListening] = useState(false);
  const { toast } = useToast();
  const recognition = useRef<any>(null);
  const promptRecognition = useRef<any>(null);

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
        isPromptListening={isPromptListening}
        toggleListening={toggleListening}
        generateText={generateText}
      />
      
      <div className="flex-1 flex flex-col">
        <EditorToolbar
          isListening={isListening}
          toggleListening={toggleListening}
          formatText={formatText}
        />
        <div
          className="flex-grow p-4 editor-content [&>p]:mb-4"
          contentEditable
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
        />
        <div className="p-4 border-t border-border min-h-[92px] flex items-center justify-center">
          <p className="text-center text-[12px] text-[#0FA0CE]">
            Su publicidad aquí
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;