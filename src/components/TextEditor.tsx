import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import PromptInput from './PromptInput';
import EditorToolbar from './EditorToolbar';
import { Loader2 } from 'lucide-react';

const TextEditor = () => {
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const { toast } = useToast();

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
        setGeneratedImage={setGeneratedImage}
      />
      
      <div className="flex-1 flex flex-col">
        <EditorToolbar
          formatText={formatText}
        />
        <div className="flex-grow p-4">
          {generatedImage && (
            <div className="mb-4">
              <img 
                src={`data:image/jpeg;base64,${generatedImage}`} 
                alt="Generated content"
                className="max-w-md rounded-lg shadow-lg"
              />
            </div>
          )}
          {isGeneratingText && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div
            className="editor-content [&>p]:mb-4"
            contentEditable
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
          />
        </div>
      </div>
    </div>
  );
};

export default TextEditor;