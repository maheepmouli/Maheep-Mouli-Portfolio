import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link, 
  Image as ImageIcon,
  Eye,
  EyeOff
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatText = (command: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = '';

    switch (command) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'underline':
        newText = `__${selectedText}__`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          newText = `[${selectedText}](${url})`;
        } else {
          return;
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          newText = `![${selectedText || 'Image'}](${imageUrl})`;
        } else {
          return;
        }
        break;
      case 'list':
        newText = `- ${selectedText}`;
        break;
      case 'orderedList':
        newText = `1. ${selectedText}`;
        break;
      case 'quote':
        newText = `> ${selectedText}`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    onChange(newContent);
    
    // Set cursor position after the formatted text
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start + newText.length, start + newText.length);
      }
    }, 0);
  };

  const renderPreview = () => {
    if (!content) return <p className="text-muted-foreground">{placeholder || "Enter your content here..."}</p>;
    
    // Simple markdown to HTML conversion
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2" />')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/^1\. (.*)/gm, '<li>$1</li>')
      .replace(/^> (.*)/gm, '<blockquote class="border-l-4 border-primary pl-4 italic">$1</blockquote>')
      .replace(/\n/g, '<br>');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Content</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowToolbar(!showToolbar)}
          >
            {showToolbar ? 'Hide' : 'Show'} Toolbar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {showToolbar && (
        <Card>
          <CardContent className="p-2">
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('bold')}
                title="Bold"
              >
                <Bold size={14} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('italic')}
                title="Italic"
              >
                <Italic size={14} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('underline')}
                title="Underline"
              >
                <Underline size={14} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('code')}
                title="Code"
              >
                <Code size={14} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('link')}
                title="Link"
              >
                <Link size={14} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('image')}
                title="Image"
              >
                <ImageIcon size={14} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('list')}
                title="Unordered List"
              >
                <List size={14} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('orderedList')}
                title="Ordered List"
              >
                <ListOrdered size={14} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('quote')}
                title="Quote"
              >
                <Quote size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          {isPreview ? (
            <div className="min-h-[300px] prose prose-invert max-w-none">
              {renderPreview()}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Enter your content here... Use the toolbar above to format your text with markdown syntax."}
              className="w-full min-h-[300px] resize-none bg-transparent border-none outline-none text-sm leading-relaxed"
            />
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Markdown supported</span>
        <span>{content.length} characters</span>
      </div>
    </div>
  );
};

export default RichTextEditor; 