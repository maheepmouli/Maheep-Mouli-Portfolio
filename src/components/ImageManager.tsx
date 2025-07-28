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
  project_id?: string;
  image_url: string;
  caption: string;
  sort_order: number;
  width?: string;
  height?: string;
  alt_text?: string;
  created_at?: string;
  file?: File; // Add file property for local files
}

interface ImageManagerProps {
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
}

const ImageManager = ({ images, onImagesChange }: ImageManagerProps) => {
  // Safety check for images array
  const safeImages = Array.isArray(images) ? images : [];
  
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
        sort_order: safeImages.length,
        width: newImage.width || '100%',
        height: newImage.height || 'auto'
      };
      
      onImagesChange([...safeImages, image]);
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

  // Enhanced preview function
  const getImagePreview = (image: ProjectImage) => {
    if (image.file) {
      return URL.createObjectURL(image.file);
    }
    return image.image_url;
  };

  const removeImage = (index: number) => {
    try {
      console.log('ImageManager: Removing image at index:', index);
      const updatedImages = safeImages.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
      toast({
        title: "Image removed",
        description: "Image has been removed from your project."
      });
    } catch (error) {
      console.error('ImageManager: Error removing image:', error);
      toast({
        title: "Error removing image",
        description: "Failed to remove image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateImage = (index: number, updates: Partial<ProjectImage>) => {
    try {
      console.log('ImageManager: Updating image at index:', index, 'with updates:', updates);
      const updatedImages = safeImages.map((image, i) => 
        i === index ? { ...image, ...updates } : image
      );
      onImagesChange(updatedImages);
      setEditingImage(null);
    } catch (error) {
      console.error('ImageManager: Error updating image:', error);
      toast({
        title: "Error updating image",
        description: "Failed to update image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    try {
      console.log('ImageManager: Moving image from', fromIndex, 'to', toIndex);
      
      // Validate indices
      if (fromIndex < 0 || fromIndex >= safeImages.length || 
          toIndex < 0 || toIndex >= safeImages.length) {
        console.error('ImageManager: Invalid indices for move operation');
        toast({
          title: "Invalid operation",
          description: "Cannot move image to that position.",
          variant: "destructive"
        });
        return;
      }
      
      const updatedImages = [...safeImages];
      const [movedImage] = updatedImages.splice(fromIndex, 1);
      updatedImages.splice(toIndex, 0, movedImage);
      
      // Update sort_order with proper error handling
      updatedImages.forEach((image, index) => {
        try {
          if (image && typeof image === 'object') {
            image.sort_order = index;
          }
        } catch (error) {
          console.error('ImageManager: Error updating sort_order for image:', error);
        }
      });
      
      console.log('ImageManager: Updated images after move:', updatedImages);
      onImagesChange(updatedImages);
      
      toast({
        title: "Image moved",
        description: "Image position has been updated."
      });
    } catch (error) {
      console.error('ImageManager: Error moving image:', error);
      // Don't let image errors affect the session
      toast({
        title: "Error moving image",
        description: "Failed to rearrange image. Please try again.",
        variant: "destructive"
      });
    }
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

  // Function to compress image
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions (max 800px width/height)
          const maxSize = 800;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          // Check if compressed image is too large for localStorage
          const sizeInBytes = Math.ceil(compressedDataUrl.length * 0.75); // Approximate size
          const maxSizeBytes = 4 * 1024 * 1024; // 4MB limit per image
          
          if (sizeInBytes > maxSizeBytes) {
            reject(new Error(`Image too large after compression (${Math.round(sizeInBytes / 1024 / 1024)}MB). Please use a smaller image.`));
            return;
          }
          
          resolve(compressedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    try {
      setIsUploading(true);
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
      
      console.log('ImageManager: Processing', imageFiles.length, 'image files');
      
      if (imageFiles.length === 0) {
        toast({
          title: "No image files",
          description: "Please select only image files (JPG, PNG, GIF, etc.).",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      // Check if adding these images would exceed a reasonable limit
      const maxImagesPerProject = 20; // Limit to 20 images per project
      if (safeImages.length + imageFiles.length > maxImagesPerProject) {
        toast({
          title: "Too many images",
          description: `You can only upload up to ${maxImagesPerProject} images per project. You currently have ${safeImages.length} images.`,
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      // Process all images concurrently and wait for all to complete
      const imagePromises = imageFiles.map(async (file, index) => {
        try {
          // Compress the image before processing
          const compressedImageUrl = await compressImage(file);
          
          const image: ProjectImage = {
            image_url: compressedImageUrl,
            caption: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for caption
            alt_text: file.name,
            sort_order: safeImages.length + index,
            width: '100%',
            height: 'auto',
            file: file
          };
          
          return image;
        } catch (error) {
          console.error('ImageManager: Error processing image:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          toast({
            title: "Image processing error",
            description: `Failed to process ${file.name}: ${errorMessage}`,
            variant: "destructive"
          });
          return null;
        }
      });

      // Wait for all images to be processed
      const processedImages = await Promise.all(imagePromises);
      const validImages = processedImages.filter(img => img !== null) as ProjectImage[];
      
      if (validImages.length > 0) {
        console.log('ImageManager: Adding', validImages.length, 'new images');
        onImagesChange([...safeImages, ...validImages]);
        
        toast({
          title: "Images uploaded",
          description: `${validImages.length} image(s) have been added to your project.`
        });
      }
      
      setIsUploading(false);
    } catch (error) {
      console.error('ImageManager: Error in handleFileUpload:', error);
      toast({
        title: "Upload error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
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
                  {isUploading ? 'Processing Images...' : 'Choose Files'}
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
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Processing images...</span>
              </div>
            )}
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
            
            {/* Image Preview */}
            {newImage.image_url && (
              <div className="border rounded-lg p-4 bg-muted/20 mb-4">
                <Label className="text-sm font-medium mb-2">Preview</Label>
                <div className="relative group">
                  <img 
                    src={newImage.image_url} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-muted flex items-center justify-center rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon size={48} className="mx-auto mb-2" />
                      <p className="text-sm">Image not found</p>
                    </div>
                  </div>
                </div>
                {newImage.caption && (
                  <p className="text-sm text-muted-foreground mt-2 italic">"{newImage.caption}"</p>
                )}
              </div>
            )}
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
                          <h3 className="text-lg font-semibold mb-4">Project Images ({safeImages.length})</h3>
            <div className="space-y-4">
                              {safeImages.map((image, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={getImagePreview(image)}
                          alt={image.alt_text || image.caption || 'Project image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // Try to refresh the image URL if it's a Supabase URL
                            if (image.image_url.includes('supabase.co')) {
                              console.log('ImageManager: Attempting to refresh Supabase image URL...');
                              const refreshedUrl = `${image.image_url}?t=${Date.now()}`;
                              target.src = refreshedUrl;
                              target.style.display = 'block';
                            }
                          }}
                          onLoad={() => {
                            console.log('ImageManager: Image loaded successfully:', image.image_url);
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