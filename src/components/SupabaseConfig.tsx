import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabaseProjectsService } from '@/services/supabaseProjectsService';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const SupabaseConfig = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'failed'>('idle');
  const [tableStatus, setTableStatus] = useState<'idle' | 'created' | 'failed'>('idle');

  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('idle');
    
    try {
      const projects = await supabaseProjectsService.getAllProjects();
      setConnectionStatus('connected');
      toast({
        title: "✅ Supabase Connected!",
        description: `Successfully connected to Supabase. Found ${projects.length} projects.`,
      });
    } catch (error) {
      setConnectionStatus('failed');
      toast({
        title: "❌ Connection Failed",
        description: "Failed to connect to Supabase. Please check your configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTable = async () => {
    setIsLoading(true);
    setTableStatus('idle');
    
    try {
      console.log('SupabaseConfig: Testing table access...');
      
      // Test if we can access the table
      const { data, error } = await supabase
        .from('projects')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('SupabaseConfig: Table access error:', error);
        setTableStatus('failed');
        toast({
          title: "❌ Table Not Found",
          description: `Table error: ${error.message}. Please run the SQL script in your Supabase dashboard.`,
          variant: "destructive"
        });
        return;
      }
      
      // If we can access the table, it exists
      setTableStatus('created');
      toast({
        title: "✅ Table Ready!",
        description: "Projects table is accessible and ready to use.",
      });
    } catch (error) {
      console.error('SupabaseConfig: Exception testing table:', error);
      setTableStatus('failed');
      toast({
        title: "❌ Table Not Found",
        description: "Please create the projects table in your Supabase dashboard. Check the instructions below.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'created':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'created':
        return 'Table Ready';
      case 'failed':
        return 'Failed';
      default:
        return 'Not Tested';
    }
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Supabase Configuration</h1>
            <p className="text-muted-foreground mt-2">
              Configure and test your Supabase database connection
            </p>
          </div>

          {/* Configuration Cards */}
          <div className="grid gap-6">
            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(connectionStatus)}
                  Database Connection
                </CardTitle>
                <CardDescription>
                  Test the connection to your Supabase database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="font-medium">{getStatusText(connectionStatus)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      URL: https://jetefprstmoewdfhhwqq.supabase.co
                    </p>
                  </div>
                  <Button 
                    onClick={handleTestConnection} 
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(tableStatus)}
                  Database Table
                </CardTitle>
                <CardDescription>
                  Check if the projects table exists and is accessible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="font-medium">{getStatusText(tableStatus)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Table: projects
                    </p>
                  </div>
                  <Button 
                    onClick={handleCreateTable} 
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4" />
                    )}
                    Check Table
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Setup Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to complete your Supabase setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">1. Create Database Table</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Go to your <a href="https://supabase.com/dashboard/project/jetefprstmoewdfhhwqq" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Supabase Dashboard</a> and run this SQL in the SQL Editor:
                    </p>
                    <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
{`-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  project_url TEXT,
  github_url TEXT,
  location TEXT,
  duration TEXT,
  team_size TEXT,
  technologies TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public read access
CREATE POLICY "Allow public read access" ON projects
FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage projects" ON projects
FOR ALL USING (auth.role() = 'authenticated');`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">2. Test Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      Click "Test Connection" above to verify your Supabase setup is working correctly.
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">3. Add Environment Variables to Vercel</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      In your Vercel dashboard, add these environment variables:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div><strong>VITE_SUPABASE_URL:</strong> https://jetefprstmoewdfhhwqq.supabase.co</div>
                      <div><strong>VITE_SUPABASE_ANON_KEY:</strong> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldGVmcHJzdG1vZXdkZmhod3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTcyMTUsImV4cCI6MjA2OTAzMzIxNX0.LB4B8Qx_oE1h1U3_Zu6FGyMGozbi0Hc7jia7Qa5TQW4</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConfig; 