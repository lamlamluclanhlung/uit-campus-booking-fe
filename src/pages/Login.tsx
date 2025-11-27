import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [account, setAccount] = useState('');   // will be sent to backend as email/username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin/approvals' : '/facilities');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!account || !password) {
      toast({
        title: 'Missing information',
        description: 'Please enter both account and password.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      // Backend currently expects email – we send account as that field
      await login(account, password);
      toast({
        title: 'Login successful',
        description: 'Welcome to the UIT classroom booking portal.',
      });
      // Navigation continues in the useEffect above
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description:
          error?.response?.data?.message ||
          'Invalid account or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        {/* Header text */}
        <div className="mb-8 text-center">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            VIETNAM NATIONAL UNIVERSITY HO CHI MINH CITY
          </p>
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            UNIVERSITY OF INFORMATION TECHNOLOGY
          </p>
          <p className="mt-3 text-xl font-bold tracking-wide text-sky-400 uppercase">
            CLASSROOM BOOKING WEBSITE
          </p>
        </div>

        {/* Login form (no register, no language switch, no cookies banner) */}
        <Card className="bg-card/90 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="account">Account</Label>
                <Input
                  id="account"
                  type="text"
                  placeholder="Account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="mt-2 text-left">
                <a
                  href="https://auth.uit.edu.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-sky-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
