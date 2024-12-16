import React from 'react';
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignJustify } from 'lucide-react';

interface AlignmentButtonsProps {
  formatText: (command: string) => void;
}

const AlignmentButtons = ({ formatText }: AlignmentButtonsProps) => {
  return (
    <>
      <Button variant="outline" size="icon" onClick={() => formatText('justifyLeft')}>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => formatText('justifyCenter')}>
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => formatText('justifyFull')}>
        <AlignJustify className="h-4 w-4" />
      </Button>
    </>
  );
};

export default AlignmentButtons;