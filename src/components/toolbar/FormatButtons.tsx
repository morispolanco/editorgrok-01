import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  Heading1, 
  Heading2, 
  Heading3,
} from 'lucide-react';

interface FormatButtonsProps {
  formatText: (command: string, value?: string) => void;
}

const FormatButtons = ({ formatText }: FormatButtonsProps) => {
  return (
    <>
      <Button variant="outline" size="icon" onClick={() => formatText('bold')}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => formatText('italic')}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => formatText('insertUnorderedList')}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => formatText('insertOrderedList')}>
        <ListOrdered className="h-4 w-4" />
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
    </>
  );
};

export default FormatButtons;