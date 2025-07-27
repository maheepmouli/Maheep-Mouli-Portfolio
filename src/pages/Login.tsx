import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, testLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password: password ? '***' : 'empty' });
    setLoading(true);
    
    try {
      const success = await login(email, password);
      console.log('Login result:', success);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    console.log('Test login button clicked');
    setLoading(true);
    try {
      const success = await testLogin();
      console.log('Test login result:', success);
      if (success) {
        toast({
          title: "Test Login Successful!",
          description: "You have been logged in for testing.",
        });
        navigate('/admin');
      }
    } catch (error) {
      console.error('Test login error:', error);
      toast({
        title: "Test Login Failed",
        description: "An error occurred during test login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = () => {
    // Set the correct credentials and try to login
    setEmail('maheep.mouli.shashi@gmail.com');
    setPassword('maheep123');
    toast({
      title: "Credentials Set",
      description: "Correct credentials have been filled in. Click Sign In to login.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Portfolio Admin</CardTitle>
          <CardDescription className="text-center">
            Access your portfolio management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          {/* Quick test button */}
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={handleQuickTest} 
              variant="secondary" 
              className="w-full mb-2" 
              disabled={loading}
            >
              Fill Correct Credentials
            </Button>
          </div>
          
          {/* Test login button - remove in production */}
          <div className="mt-2">
            <Button 
              onClick={handleTestLogin} 
              variant="outline" 
              className="w-full" 
              disabled={loading}
            >
              Test Login (Bypass)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 