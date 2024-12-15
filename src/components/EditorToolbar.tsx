import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Undo, Redo, Bold, Italic, List, Heading1, Heading2, Heading3 } from 'lucide-react';

interface EditorToolbarProps {
  isListening: boolean;
  toggleListening: (isPrompt: boolean) => void;
  formatText: (command: string, value?: string) => void;
}

const EditorToolbar = ({ isListening, toggleListening, formatText }: EditorToolbarProps) => {
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
  );
};

export default EditorToolbar;