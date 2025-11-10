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
  EyeOff,
  Palette,
  Sparkles
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  compact?: boolean; // For smaller fields like title, subtitle
  minHeight?: string; // Custom minimum height
}

const RichTextEditor = ({ content, onChange, placeholder, compact = false, minHeight }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(compact ? false : true);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [gradientPickerOpen, setGradientPickerOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const editorHeight = minHeight || (compact ? 'min-h-[120px]' : 'min-h-[400px]');

  const formatText = (command: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = '';
    let cursorOffset = 0;

    switch (command) {
      case 'bold':
        if (selectedText) {
          newText = `**${selectedText}**`;
          cursorOffset = newText.length;
        } else {
          // Insert placeholder text that user can replace
          newText = `**bold text**`;
          cursorOffset = 2; // Position cursor after opening **
        }
        break;
      case 'italic':
        if (selectedText) {
          newText = `*${selectedText}*`;
          cursorOffset = newText.length;
        } else {
          newText = `*italic text*`;
          cursorOffset = 1;
        }
        break;
      case 'underline':
        if (selectedText) {
          // Check if text already has formatting (bold, color, gradient, HTML tags)
          // The selected text might contain HTML tags from previous formatting
          // We need to wrap the entire selection with underline, preserving any existing formatting
          if (selectedText.includes('<span') || selectedText.includes('**') || selectedText.includes('<strong') || selectedText.includes('<em') || selectedText.includes('<u>')) {
            // Text has formatting - wrap the entire formatted text with underline
            // This preserves bold, colors, gradients, etc.
            newText = `<u>${selectedText}</u>`;
          } else {
            // Plain text - just add underline
            newText = `<u>${selectedText}</u>`;
          }
          cursorOffset = newText.length;
        } else {
          newText = `<u>underlined text</u>`;
          cursorOffset = 3; // Position after <u>
        }
        break;
      case 'code':
        if (selectedText) {
          newText = `\`${selectedText}\``;
          cursorOffset = newText.length;
        } else {
          newText = `\`code\``;
          cursorOffset = 1;
        }
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (!url) return;
        if (selectedText) {
          newText = `[${selectedText}](${url})`;
          cursorOffset = newText.length;
        } else {
          newText = `[link text](${url})`;
          cursorOffset = 1; // Position at start of "link text"
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (!imageUrl) return;
        if (selectedText) {
          newText = `![${selectedText}](${imageUrl})`;
          cursorOffset = newText.length;
        } else {
          newText = `![Image description](${imageUrl})`;
          cursorOffset = 2; // Position at start of "Image description"
        }
        break;
      case 'list':
        if (selectedText) {
          // If text is selected, wrap each line
          const lines = selectedText.split('\n');
          newText = lines.map(line => line.trim() ? `- ${line.trim()}` : '').filter(l => l).join('\n');
          cursorOffset = newText.length;
        } else {
          newText = `- List item`;
          cursorOffset = 2; // Position after "- "
        }
        break;
      case 'orderedList':
        if (selectedText) {
          const lines = selectedText.split('\n');
          newText = lines.map((line, idx) => line.trim() ? `${idx + 1}. ${line.trim()}` : '').filter(l => l).join('\n');
          cursorOffset = newText.length;
        } else {
          newText = `1. List item`;
          cursorOffset = 3; // Position after "1. "
        }
        break;
      case 'quote':
        if (selectedText) {
          const lines = selectedText.split('\n');
          newText = lines.map(line => line.trim() ? `> ${line.trim()}` : '').filter(l => l).join('\n');
          cursorOffset = newText.length;
        } else {
          newText = `> Quote text`;
          cursorOffset = 2; // Position after "> "
        }
        break;
      case 'color':
        const color = value || '#ffffff';
        if (selectedText) {
          newText = `<span style="color: ${color}">${selectedText}</span>`;
          cursorOffset = newText.length;
        } else {
          newText = `<span style="color: ${color}">colored text</span>`;
          cursorOffset = newText.indexOf('>') + 1;
        }
        break;
      case 'gradient':
        const gradientColors = value || 'linear-gradient(90deg, #00C8FF, #FF4C4C)';
        if (selectedText) {
          newText = `<span style="background: ${gradientColors}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${selectedText}</span>`;
          cursorOffset = newText.length;
        } else {
          newText = `<span style="background: ${gradientColors}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">gradient text</span>`;
          cursorOffset = newText.indexOf('>') + 1;
        }
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    onChange(newContent);
    
    // Set cursor position - select the placeholder text so user can type over it
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        if (selectedText) {
          // If text was selected, place cursor at end
          textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
        } else {
          // If no text selected, select the placeholder text so user can replace it
          let placeholderStart = 0;
          let placeholderEnd = 0;
          
          if (command === 'bold') {
            placeholderStart = start + 2;
            placeholderEnd = start + newText.length - 2;
          } else if (command === 'underline') {
            placeholderStart = start + 3; // After <u>
            placeholderEnd = start + newText.length - 4; // Before </u>
          } else if (command === 'code') {
            placeholderStart = start + 1;
            placeholderEnd = start + newText.length - 1;
          } else if (command === 'link') {
            placeholderStart = start + 1;
            placeholderEnd = start + newText.indexOf(']');
          } else if (command === 'image') {
            placeholderStart = start + 2;
            placeholderEnd = start + newText.indexOf(']');
          } else if (command === 'list') {
            placeholderStart = start + 2;
            placeholderEnd = start + newText.length;
          } else if (command === 'orderedList') {
            placeholderStart = start + 3;
            placeholderEnd = start + newText.length;
          } else if (command === 'quote') {
            placeholderStart = start + 2;
            placeholderEnd = start + newText.length;
          } else if (command === 'color' || command === 'gradient') {
            placeholderStart = newText.indexOf('>') + 1;
            placeholderEnd = start + newText.length - 7; // Before </span>
          } else {
            placeholderStart = start;
            placeholderEnd = start + newText.length;
          }
          
          textarea.setSelectionRange(placeholderStart, placeholderEnd);
        }
      }
    }, 0);
  };

  const renderPreview = () => {
    if (!content) return (
      <div className="text-center py-12">
        <p className="!text-white/50 italic">{placeholder || "Enter your content here..."}</p>
      </div>
    );
    
    // Enhanced markdown to HTML conversion with better styling
    // Process in correct order to preserve nested formatting
    let html = content
      // Headers first
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 !text-white">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 !text-white">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5 !text-white">$1</h1>')
      // Process markdown bold and italic first
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold !text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic !text-white/90">$1</em>')
      // Handle markdown underline
      .replace(/__(.*?)__/g, '<u class="underline decoration-current">$1</u>')
      // Handle HTML underline tags - preserve any nested formatting
      // Use a more robust regex that handles nested tags
      .replace(/<u>((?:[^<]|<(?!\/u>)(?:[^<]|<(?!\/u>))*?)*?)<\/u>/g, (match, content) => {
        // Content might have <strong>, <span>, etc. - preserve them all
        // The underline will inherit the text color from nested elements via decoration-current
        return `<u class="underline decoration-current">${content}</u>`;
      })
      // Handle color spans
      .replace(/<span style="color: ([^"]+)">(.*?)<\/span>/g, '<span style="color: $1">$2</span>')
      // Handle gradient spans  
      .replace(/<span style="background: ([^"]+); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">(.*?)<\/span>/g, '<span style="background: $1; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">$2</span>')
      // Fix nested structures: If span wraps underline, reorder so underline wraps span
      // This ensures underline inherits the color/gradient from the span
      .replace(/<span style="color: ([^"]+)">(<u[^>]*>)(.*?)(<\/u>)<\/span>/g, '<u class="underline decoration-current"><span style="color: $1">$3</span></u>')
      .replace(/<span style="background: ([^"]+); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">(<u[^>]*>)(.*?)(<\/u>)<\/span>/g, '<u class="underline decoration-current"><span style="background: $1; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">$3</span></u>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm !text-white/90">$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono !text-primary border border-primary/20">$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-4"><img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-lg border border-border/50" /></div>')
      // Lists
      .replace(/^- (.*)/gm, '<li class="ml-4 mb-1 !text-white/90">$1</li>')
      .replace(/^1\. (.*)/gm, '<li class="ml-4 mb-1 !text-white/90">$1</li>')
      // Blockquotes
      .replace(/^> (.*)/gm, '<blockquote class="border-l-4 border-primary pl-4 italic my-4 !text-white/80 bg-muted/30 py-2 rounded-r">$1</blockquote>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 !text-white/90 leading-relaxed">')
      .replace(/\n/g, '<br>');

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
      html = '<p class="mb-4 !text-white/90 leading-relaxed">' + html + '</p>';
    } else if (!html.includes('<p')) {
      html = '<p class="mb-4 !text-white/90 leading-relaxed">' + html + '</p>';
    }

    return <div className="rich-content" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {/* Enhanced Header - Compact version for compact mode */}
      {compact ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowToolbar(!showToolbar)}
            className="h-7 px-2 text-xs hover:bg-primary/10 transition-colors"
            title={showToolbar ? 'Hide Formatting' : 'Show Formatting'}
          >
            {showToolbar ? 'Hide' : 'Format'}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-card to-card/80 rounded-lg border border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <Label className="text-base font-semibold">Rich Text Editor</Label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowToolbar(!showToolbar)}
              className="hover:bg-primary/10 transition-colors"
            >
              {showToolbar ? 'Hide' : 'Show'} Toolbar
            </Button>
            <Button
              type="button"
              variant={isPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className="hover:bg-primary/10 transition-colors"
            >
              {isPreview ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Toolbar */}
      {showToolbar && (
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="p-3 bg-gradient-to-br from-card to-muted/20">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md">
                <span className="text-xs font-medium !text-white/60 uppercase tracking-wider">Format</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('bold')}
                title="Bold (Ctrl+B)"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Bold size={16} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('italic')}
                title="Italic (Ctrl+I)"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Italic size={16} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('underline')}
                title="Underline (Ctrl+U)"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Underline size={16} />
              </Button>
              <div className="w-px h-6 bg-border mx-1"></div>
              {/* Color Picker */}
              <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    title="Text Color"
                    className="hover:bg-primary/10 hover:border-primary/50 transition-all"
                  >
                    <Palette size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-64 p-4 z-[9999] bg-card border-border" 
                  align="start"
                  side="bottom"
                  sideOffset={5}
                >
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold !text-white">Solid Color</Label>
                    <div className="grid grid-cols-8 gap-2">
                      {[
                        '#FFFFFF', '#00C8FF', '#FF4C4C', '#FFD700',
                        '#9B59B6', '#2ECC71', '#E74C3C', '#3498DB',
                        '#F39C12', '#1ABC9C', '#E67E22', '#95A5A6',
                        '#34495E', '#16A085', '#8E44AD', '#C0392B'
                      ].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            formatText('color', color);
                            setColorPickerOpen(false);
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="pt-2 border-t border-border">
                      <Label className="text-xs !text-white/60 mb-2 block">Custom Color</Label>
                      <input
                        type="color"
                        className="w-full h-10 rounded cursor-pointer"
                        onChange={(e) => {
                          formatText('color', e.target.value);
                          setColorPickerOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {/* Gradient Picker */}
              <Popover open={gradientPickerOpen} onOpenChange={setGradientPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    title="Gradient Color"
                    className="hover:bg-primary/10 hover:border-primary/50 transition-all"
                  >
                    <Sparkles size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-80 p-4 z-[9999] bg-card border-border"
                  align="start"
                  side="bottom"
                  sideOffset={5}
                >
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Gradient Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Primary', gradient: 'linear-gradient(90deg, #00C8FF, #FF4C4C)' },
                        { name: 'Ocean', gradient: 'linear-gradient(90deg, #00C8FF, #0066FF)' },
                        { name: 'Sunset', gradient: 'linear-gradient(90deg, #FF4C4C, #FFD700)' },
                        { name: 'Purple', gradient: 'linear-gradient(90deg, #9B59B6, #E74C3C)' },
                        { name: 'Green', gradient: 'linear-gradient(90deg, #2ECC71, #16A085)' },
                        { name: 'Blue', gradient: 'linear-gradient(90deg, #3498DB, #00C8FF)' },
                        { name: 'Rainbow', gradient: 'linear-gradient(90deg, #FF4C4C, #FFD700, #2ECC71, #00C8FF, #9B59B6)' },
                        { name: 'Fire', gradient: 'linear-gradient(90deg, #FFD700, #FF4C4C, #E74C3C)' }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          className="h-10 rounded border border-border hover:scale-105 transition-transform text-xs font-medium text-white cursor-pointer"
                          style={{ background: preset.gradient }}
                          onClick={(e) => {
                            e.stopPropagation();
                            formatText('gradient', preset.gradient);
                            setGradientPickerOpen(false);
                          }}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 border-t space-y-2">
                      <Label className="text-xs text-muted-foreground mb-2 block">Custom Gradient</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs mb-1 block">Color 1</Label>
                          <input
                            type="color"
                            id="gradient-color-1"
                            className="w-full h-8 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">Color 2</Label>
                          <input
                            type="color"
                            id="gradient-color-2"
                            className="w-full h-8 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          const color1 = (document.getElementById('gradient-color-1') as HTMLInputElement)?.value || '#00C8FF';
                          const color2 = (document.getElementById('gradient-color-2') as HTMLInputElement)?.value || '#FF4C4C';
                          formatText('gradient', `linear-gradient(90deg, ${color1}, ${color2})`);
                          setGradientPickerOpen(false);
                        }}
                      >
                        Apply Gradient
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="w-px h-6 bg-border mx-1"></div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('code')}
                title="Inline Code"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Code size={16} />
              </Button>
              <div className="w-px h-6 bg-border mx-1"></div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('link')}
                title="Insert Link"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Link size={16} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('image')}
                title="Insert Image"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <ImageIcon size={16} />
              </Button>
              <div className="w-px h-6 bg-border mx-1"></div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('list')}
                title="Bullet List"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <List size={16} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('orderedList')}
                title="Numbered List"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <ListOrdered size={16} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('quote')}
                title="Blockquote"
                className="hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Quote size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Editor Area */}
      <Card className="border-primary/20 shadow-lg" style={{ overflow: 'visible' }}>
        <CardContent className="p-0" style={{ position: 'relative', zIndex: 1 }}>
          {isPreview ? (
            <div className={`${editorHeight} ${compact ? 'p-3' : 'p-6'} prose prose-invert max-w-none bg-gradient-to-b from-card to-card/95`}>
              {!compact && (
                <div className="mb-4 pb-3 border-b border-border/50">
                  <h3 className="text-sm font-semibold !text-white/80 uppercase tracking-wider">Preview</h3>
                </div>
              )}
              <div className="!text-white/90 leading-relaxed">
                {renderPreview()}
              </div>
            </div>
          ) : (
            <div className="relative" style={{ zIndex: 10 }}>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onChange(e.target.value)}
                onFocus={(e) => {
                  e.target.focus();
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder={placeholder || (compact ? "Type here..." : "Start typing your content here...\n\nUse the toolbar above to format your text with markdown syntax.\n\nExamples:\n**Bold text**\n*Italic text*\n- List item\n1. Numbered item\n> Quote\n[Link text](url)")}
                className={`w-full ${editorHeight} ${compact ? 'p-3' : 'p-6'} resize-none bg-gradient-to-b from-card to-card/95 border-none outline-none text-sm leading-relaxed focus:ring-2 focus:ring-primary/20 transition-all !text-white/90 placeholder:!text-white/40 cursor-text`}
                style={{ 
                  pointerEvents: 'auto', 
                  zIndex: 10,
                  position: 'relative'
                }}
                autoFocus={false}
              />
              {!compact && (
                <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 text-xs !text-white/50 bg-card/80 px-2 py-1 rounded-md backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span>Markdown enabled</span>
                  </div>
                  <div className="text-xs !text-white/40 bg-card/60 px-2 py-1 rounded-md backdrop-blur-sm">
                    Tip: Select text to format, or click format buttons to insert placeholder text
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Footer Stats - Hide in compact mode */}
      {!compact && (
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-card to-card/80 rounded-lg border border-border/50">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/70"></div>
              <span className="!text-white/60">Markdown supported</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <span className="!text-white/60">
              {content.split(/\s+/).filter(word => word.length > 0).length} words
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="!text-white/80">{content.length}</span>
            <span className="!text-white/50">characters</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor; 