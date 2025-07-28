import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  HardDrive, 
  Database, 
  Settings, 
  Upload, 
  Download, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  storageService, 
  configureSupabase 
} from '@/services/storageService';

const StorageManager = () => {
  const { toast } = useToast();
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [storageInfo, setStorageInfo] = useState<{ used: number; total: number } | null>(null);

  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    key: ''
  });

  useEffect(() => {
    updateStorageInfo();
    setCurrentProvider(storageService.getCurrentProvider().name);
    
    // Auto-load Supabase credentials from localStorage if available
    const savedUrl = localStorage.getItem('supabase_url');
    const savedKey = localStorage.getItem('supabase_key');
    if (savedUrl && savedKey) {
      setSupabaseConfig({
        url: savedUrl,
        key: savedKey
      });
      // Auto-configure Supabase
      configureSupabase(savedUrl, savedKey);
      handleProviderChange('Supabase');
    }
  }, []);

  const updateStorageInfo = async () => {
    const info = await storageService.getStorageInfo();
    setStorageInfo(info);
  };

  const handleProviderChange = (providerName: string) => {
    const success = storageService.setProvider(providerName);
    if (success) {
      setCurrentProvider(providerName);
      updateStorageInfo();
      toast({
        title: "Storage Provider Changed",
        description: `Switched to ${providerName}`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to switch to ${providerName}`,
        variant: "destructive"
      });
    }
  };



  const handleSupabaseSetup = () => {
    if (supabaseConfig.url && supabaseConfig.key) {
      configureSupabase(supabaseConfig.url, supabaseConfig.key);
      handleProviderChange('Supabase');
      toast({
        title: "Supabase Configured",
        description: "Supabase storage is now available",
      });
    } else {
      toast({
        title: "Configuration Error",
        description: "Please fill in all Supabase configuration fields",
        variant: "destructive"
      });
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStoragePercentage = (): number => {
    if (!storageInfo) return 0;
    return (storageInfo.used / storageInfo.total) * 100;
  };

  const getStorageColor = (percentage: number): string => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const availableProviders = storageService.getAvailableProviders();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Storage Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Storage Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Storage</h3>
              <Badge variant="outline">
                {currentProvider}
              </Badge>
            </div>
            
            {storageInfo && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {formatBytes(storageInfo.used)}</span>
                  <span>Total: {formatBytes(storageInfo.total)}</span>
                </div>
                <Progress 
                  value={getStoragePercentage()} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{getStoragePercentage().toFixed(1)}% used</span>
                  <span>{formatBytes(storageInfo.total - storageInfo.used)} available</span>
                </div>
              </div>
            )}
          </div>

          {/* Storage Providers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Storage Providers</h3>
            
            {/* Compressed Local Storage */}
            <Card className="border-2 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HardDrive className="text-green-600" size={20} />
                    <div>
                      <h4 className="font-medium">Compressed Local Storage</h4>
                      <p className="text-sm text-muted-foreground">
                        Enhanced local storage with compression (5MB limit)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Always Available</Badge>
                    {currentProvider === 'Compressed Local Storage' && (
                      <CheckCircle className="text-green-600" size={16} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Supabase */}
            <Card className="border-2 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Database className="text-purple-600" size={20} />
                    <div>
                      <h4 className="font-medium">Supabase</h4>
                      <p className="text-sm text-muted-foreground">
                        Database storage with 1GB free space
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">1GB Free</Badge>
                    {currentProvider === 'Supabase' && (
                      <CheckCircle className="text-green-600" size={16} />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="supabase-url">Project URL</Label>
                    <Input
                      id="supabase-url"
                      value={supabaseConfig.url}
                      onChange={(e) => setSupabaseConfig(prev => ({
                        ...prev,
                        url: e.target.value
                      }))}
                      placeholder="https://your-project.supabase.co"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supabase-key">API Key</Label>
                    <Input
                      id="supabase-key"
                      type="password"
                      value={supabaseConfig.key}
                      onChange={(e) => setSupabaseConfig(prev => ({
                        ...prev,
                        key: e.target.value
                      }))}
                      placeholder="Supabase API Key"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSupabaseSetup}
                  className="mt-3"
                  disabled={!supabaseConfig.url || !supabaseConfig.key}
                >
                  <Database size={16} className="mr-2" />
                  Configure Supabase
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                onClick={updateStorageInfo}
                className="flex items-center gap-2"
              >
                <Info size={16} />
                Refresh Storage Info
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleProviderChange('Compressed Local Storage')}
                className="flex items-center gap-2"
              >
                <HardDrive size={16} />
                Switch to Local
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.clear();
                  updateStorageInfo();
                  toast({
                    title: "Storage Cleared",
                    description: "All local storage data has been cleared",
                  });
                }}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear Local Storage
              </Button>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Setup Instructions</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Google Drive Setup:</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                  <li>Create a new project or select existing one</li>
                  <li>Enable Google Drive API</li>
                  <li>Create credentials (API Key and OAuth 2.0 Client ID)</li>
                  <li>Create a folder in Google Drive and get its ID</li>
                </ol>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Supabase Setup:</h4>
                <ol className="list-decimal list-inside space-y-1 text-purple-800">
                  <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">Supabase</a></li>
                  <li>Create a new project</li>
                  <li>Get your project URL from Settings → API</li>
                  <li>Get your API key from Settings → API</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageManager; 