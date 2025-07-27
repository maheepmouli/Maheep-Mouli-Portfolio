import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Play, ExternalLink, Youtube, HardDrive } from 'lucide-react';

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'drive';
  description?: string;
}

interface VideoManagerProps {
  videos: VideoItem[];
  onVideosChange: (videos: VideoItem[]) => void;
}

const VideoManager = ({ videos, onVideosChange }: VideoManagerProps) => {
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    type: 'youtube' as 'youtube' | 'drive',
    description: ''
  });

  const addVideo = () => {
    if (!newVideo.title.trim() || !newVideo.url.trim()) return;

    const videoItem: VideoItem = {
      id: Date.now().toString(),
      title: newVideo.title.trim(),
      url: newVideo.url.trim(),
      type: newVideo.type,
      description: newVideo.description.trim() || undefined
    };

    onVideosChange([...videos, videoItem]);
    setNewVideo({ title: '', url: '', type: 'youtube', description: '' });
  };

  const removeVideo = (id: string) => {
    onVideosChange(videos.filter(video => video.id !== id));
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  const getGoogleDriveEmbedUrl = (url: string) => {
    // Convert Google Drive sharing URL to embed URL
    const driveIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (driveIdMatch) {
      return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
    }
    return url;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addVideo();
    }
  };

  return (
    <div className="space-y-4">
      {/* Add New Video */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play size={20} />
            Add Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video-title">Video Title *</Label>
              <Input
                id="video-title"
                value={newVideo.title}
                onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Project Demo Video"
                onKeyPress={handleKeyPress}
              />
            </div>
            <div>
              <Label htmlFor="video-type">Video Type</Label>
              <select
                id="video-type"
                value={newVideo.type}
                onChange={(e) => setNewVideo(prev => ({ ...prev, type: e.target.value as 'youtube' | 'drive' }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="youtube">YouTube</option>
                <option value="drive">Google Drive</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="video-url">
              {newVideo.type === 'youtube' ? 'YouTube URL *' : 'Google Drive URL *'}
            </Label>
            <Input
              id="video-url"
              value={newVideo.url}
              onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
              placeholder={
                newVideo.type === 'youtube' 
                  ? "https://www.youtube.com/watch?v=..." 
                  : "https://drive.google.com/file/d/..."
              }
              onKeyPress={handleKeyPress}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {newVideo.type === 'youtube' 
                ? "Paste any YouTube video URL (watch, share, or embed link)"
                : "Paste Google Drive sharing URL (make sure it's set to 'Anyone with the link can view')"
              }
            </p>
          </div>

          <div>
            <Label htmlFor="video-description">Description (Optional)</Label>
            <Input
              id="video-description"
              value={newVideo.description}
              onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the video content"
              onKeyPress={handleKeyPress}
            />
          </div>

          <Button type="button" onClick={addVideo} variant="outline" className="w-full">
            <Plus size={16} className="mr-2" />
            Add Video
          </Button>
        </CardContent>
      </Card>

      {/* Video List */}
      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Videos ({videos.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {videos.map((video, index) => (
              <div key={video.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {video.type === 'youtube' ? <Youtube size={14} /> : <HardDrive size={14} />}
                        {video.type === 'youtube' ? 'YouTube' : 'Google Drive'}
                      </Badge>
                      <h4 className="font-medium">{video.title}</h4>
                    </div>
                    {video.description && (
                      <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(video.url, '_blank')}
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Open Original
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVideo(video.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X size={16} />
                  </Button>
                </div>

                {/* Video Preview */}
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={
                      video.type === 'youtube' 
                        ? getYouTubeEmbedUrl(video.url)
                        : getGoogleDriveEmbedUrl(video.url)
                    }
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {videos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Play size={48} className="mx-auto mb-4 opacity-50" />
          <p>No videos added yet. Add your first video above.</p>
        </div>
      )}
    </div>
  );
};

export default VideoManager; 