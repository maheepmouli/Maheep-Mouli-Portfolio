import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter your content here..."}
        className="min-h-[300px] resize-none"
      />
      <p className="text-sm text-muted-foreground">
        Use plain text for now. Rich text editing will be added in a future update.
      </p>
    </div>
  );
};

export default RichTextEditor; 