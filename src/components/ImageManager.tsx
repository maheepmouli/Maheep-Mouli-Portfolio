import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon, 
  Move, 
  Settings,
  ExternalLink,
  Copy,
  FileImage,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectImage {
  id?: string;
  image_url: string;
  caption: string;
  sort_order: number;
  width?: string;
  height?: string;
  alt_text?: string;
  file?: File; // Add file property for local files
}

interface ImageManagerProps {
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
}

const ImageManager = ({ images, onImagesChange }: ImageManagerProps) => {
  const [newImage, setNewImage] = useState({
    image_url: '',
    caption: '',
    alt_text: '',
    width: '100%',
    height: 'auto'
  });
  const [editingImage, setEditingImage] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addImage = () => {
    if (newImage.image_url.trim()) {
      const image: ProjectImage = {
        ...newImage,
        sort_order: images.length,
        width: newImage.width || '100%',
        height: newImage.height || 'auto'
      };
      
      onImagesChange([...images, image]);
      setNewImage({
        image_url: '',
        caption: '',
        alt_text: '',
        width: '100%',
        height: 'auto'
      });
      
      toast({
        title: "Image added",
        description: "Image has been added to your project."
      });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
    toast({
      title: "Image removed",
      description: "Image has been removed from your project."
    });
  };

  const updateImage = (index: number, updates: Partial<ProjectImage>) => {
    const updatedImages = images.map((image, i) => 
      i === index ? { ...image, ...updates } : image
    );
    onImagesChange(updatedImages);
    setEditingImage(null);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    
    // Update sort_order
    updatedImages.forEach((image, index) => {
      image.sort_order = index;
    });
    
    onImagesChange(updatedImages);
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Image URL has been copied to clipboard."
    });
  };

  const downloadImage = (image: ProjectImage) => {
    if (image.file) {
      // For local files, create a download link
      const link = document.createElement('a');
      link.href = image.image_url;
      link.download = image.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For external URLs, try to download
      const link = document.createElement('a');
      link.href = image.image_url;
      link.download = image.caption || 'image';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast({
      title: "Download started",
      description: "Image download has been initiated."
    });
  };

  const handleFileUpload = (files: FileList | File[]) => {
    setIsUploading(true);
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "No image files",
        description: "Please select only image files (JPG, PNG, GIF, etc.).",
        variant: "destructive"
      });
      setIsUploading(false);
      return;
    }

    // Process each image file
    imageFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const image: ProjectImage = {
          image_url: imageUrl,
          caption: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for caption
          alt_text: file.name,
          sort_order: images.length + index,
          width: '100%',
          height: 'auto',
          file: file
        };
        
        onImagesChange([...images, image]);
      };
      reader.readAsDataURL(file);
    });

    toast({
      title: "Images uploaded",
      description: `${imageFiles.length} image(s) have been added to your project.`
    });
    
    setIsUploading(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${
              isDragOver ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <Upload size={32} className={isDragOver ? 'text-primary' : 'text-muted-foreground'} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Upload multiple images from your computer
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  <FileImage size={16} className="mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose Files'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setNewImage(prev => ({ ...prev, image_url: '' }))}
                >
                  <ExternalLink size={16} className="mr-2" />
                  Add URL Instead
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF, WebP (Max 10MB per file)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Add New Image by URL */}
      {newImage.image_url === '' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Add Image by URL</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="new-image-url">Image URL *</Label>
                <Input
                  id="new-image-url"
                  value={newImage.image_url}
                  onChange={(e) => setNewImage(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="new-image-caption">Caption</Label>
                <Input
                  id="new-image-caption"
                  value={newImage.caption}
                  onChange={(e) => setNewImage(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Image description"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="new-image-alt">Alt Text</Label>
                <Input
                  id="new-image-alt"
                  value={newImage.alt_text}
                  onChange={(e) => setNewImage(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Accessibility description"
                />
              </div>
              <div>
                <Label htmlFor="new-image-width">Width</Label>
                <Input
                  id="new-image-width"
                  value={newImage.width}
                  onChange={(e) => setNewImage(prev => ({ ...prev, width: e.target.value }))}
                  placeholder="100% or 500px"
                />
              </div>
              <div>
                <Label htmlFor="new-image-height">Height</Label>
                <Input
                  id="new-image-height"
                  value={newImage.height}
                  onChange={(e) => setNewImage(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="auto or 300px"
                />
              </div>
            </div>
            <Button onClick={addImage} disabled={!newImage.image_url.trim()}>
              <Plus size={16} className="mr-2" />
              Add Image
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Images ({images.length})</h3>
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={image.image_url}
                          alt={image.alt_text || image.caption || 'Project image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {image.file && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                            <FileImage size={12} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 min-w-0">
                      {editingImage === index ? (
                        <div className="space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`caption-${index}`}>Caption</Label>
                              <Input
                                id={`caption-${index}`}
                                value={image.caption}
                                onChange={(e) => updateImage(index, { caption: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`alt-${index}`}>Alt Text</Label>
                              <Input
                                id={`alt-${index}`}
                                value={image.alt_text || ''}
                                onChange={(e) => updateImage(index, { alt_text: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`width-${index}`}>Width</Label>
                              <Input
                                id={`width-${index}`}
                                value={image.width || '100%'}
                                onChange={(e) => updateImage(index, { width: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`height-${index}`}>Height</Label>
                              <Input
                                id={`height-${index}`}
                                value={image.height || 'auto'}
                                onChange={(e) => updateImage(index, { height: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setEditingImage(null)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingImage(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium truncate">
                              {image.caption || 'No caption'}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 truncate">
                            {image.image_url}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Size: {image.width} × {image.height}</span>
                            {image.alt_text && <span>• Alt: {image.alt_text}</span>}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyImageUrl(image.image_url)}
                        title="Copy URL"
                      >
                        <Copy size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(image.image_url, '_blank')}
                        title="Open in new tab"
                      >
                        <ExternalLink size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadImage(image)}
                        title="Download image"
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingImage(editingImage === index ? null : index)}
                        title="Edit image"
                      >
                        <Settings size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeImage(index)}
                        title="Remove image"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* Move Controls */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">Move:</span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={index === 0}
                      onClick={() => moveImage(index, index - 1)}
                    >
                      ↑ Up
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, index + 1)}
                    >
                      ↓ Down
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageManager; 