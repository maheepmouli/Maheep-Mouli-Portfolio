import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Save, RotateCcw, FileImage, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageEditorProps {
  currentImageUrl: string;
  onImageChange: (imageUrl: string, file?: File) => void;
  onCancel?: () => void;
}

const ProfileImageEditor = ({ currentImageUrl, onImageChange, onCancel }: ProfileImageEditorProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(currentImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    if (imageFiles.length > 1) {
      toast({
        title: "Multiple files selected",
        description: "Please select only one image file for your profile picture.",
        variant: "destructive"
      });
      setIsUploading(false);
      return;
    }

    const file = imageFiles[0];
    
    // Check file size (max 5MB for profile image)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Profile image must be less than 5MB.",
        variant: "destructive"
      });
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setSelectedFile(file);
      setIsUploading(false);
      
      toast({
        title: "Image uploaded",
        description: "Profile image has been uploaded successfully."
      });
    };
    reader.readAsDataURL(file);
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

  const handleSave = () => {
    onImageChange(selectedImage, selectedFile || undefined);
    toast({
      title: "Profile image updated",
      description: "Your profile image has been updated successfully."
    });
  };

  const handleReset = () => {
    setSelectedImage(currentImageUrl);
    setSelectedFile(null);
    toast({
      title: "Image reset",
      description: "Profile image has been reset to original."
    });
  };

  const downloadImage = () => {
    if (selectedFile) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = 'profile-image';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast({
      title: "Download started",
      description: "Profile image download has been initiated."
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage size={20} />
          Edit Profile Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Image Preview */}
        <div className="text-center">
          <Label className="text-sm font-medium mb-3 block">Current Profile Image</Label>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative p-2 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-spin-slow">
              <img 
                src={selectedImage} 
                alt="Profile Preview" 
                className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/maheep.jpg'; // Fallback to default image
                }}
              />
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Upload New Image</Label>
          
          {/* Drag & Drop Zone */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${
                isDragOver ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <Upload size={24} className={isDragOver ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <div>
                <h4 className="font-medium mb-1">
                  {isDragOver ? 'Drop image here' : 'Drag & drop image here'}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Or click to select from your computer
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  <FileImage size={16} className="mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose Image'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Image Info */}
        {selectedFile && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Selected Image</h4>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Name:</span> {selectedFile.name}</p>
              <p><span className="font-medium">Size:</span> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><span className="font-medium">Type:</span> {selectedFile.type}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={downloadImage}
            disabled={!selectedImage}
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleReset}
            disabled={selectedImage === currentImageUrl}
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={onCancel}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          )}
          <Button 
            type="button" 
            size="sm"
            onClick={handleSave}
            disabled={selectedImage === currentImageUrl}
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageEditor; 