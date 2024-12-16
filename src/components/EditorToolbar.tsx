import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormatButtons from './toolbar/FormatButtons';
import EditButtons from './toolbar/EditButtons';
import AlignmentButtons from './toolbar/AlignmentButtons';
import ExportButtons from './toolbar/ExportButtons';

interface EditorToolbarProps {
  formatText: (command: string, value?: string) => void;
}

const EditorToolbar = ({ formatText }: EditorToolbarProps) => {
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60, 72, 96, 120];

  const handleDelete = () => {
    document.execCommand('delete', false);
  };

  const handleFontSize = (size: string) => {
    formatText('fontSize', size);
  };

  return (
    <div className="border-b border-border p-4">
      <div className="flex space-x-2">
        <FormatButtons formatText={formatText} />
        <EditButtons onDelete={handleDelete} />
        <AlignmentButtons formatText={formatText} />
        <ExportButtons />
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