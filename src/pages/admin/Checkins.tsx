import { useState } from 'react';
import { adminAPI } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QrCode, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

export default function Checkins() {
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastCheckin, setLastCheckin] = useState<any>(null);
  const { toast } = useToast();

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrToken.trim()) {
      toast({
        title: 'Please enter a QR token',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await adminAPI.checkinByQR(qrToken);
      setLastCheckin(data);
      toast({
        title: 'Check-in successful',
        description: 'Student has been checked in',
      });
      setQrToken('');
    } catch (error: any) {
      toast({
        title: 'Check-in failed',
        description: error.response?.data?.message || 'Invalid QR token or booking not approved',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Check-in Management</h1>
            <p className="text-muted-foreground">Process student check-ins using QR tokens</p>
          </div>

          <Tabs defaultValue="checkin" className="space-y-6">
            <TabsList>
              <TabsTrigger value="approvals" asChild>
                <Link to="/admin/approvals">Pending Approvals</Link>
              </TabsTrigger>
              <TabsTrigger value="checkin">Check-in</TabsTrigger>
              <TabsTrigger value="reports" asChild>
                <Link to="/admin/reports">Reports</Link>
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Code Check-in
                  </CardTitle>
                  <CardDescription>Scan or enter the student's QR token</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="qrToken">QR Token</Label>
                      <Input
                        id="qrToken"
                        placeholder="Enter QR token..."
                        value={qrToken}
                        onChange={(e) => setQrToken(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Processing...' : 'Check In'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {lastCheckin && (
                <Card className="border-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      Last Check-in
                    </CardTitle>
                    <CardDescription>Successfully checked in</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Student</p>
                      <p className="font-medium">{lastCheckin.booking?.user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Facility</p>
                      <p className="font-medium">{lastCheckin.booking?.facility?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {new Date(lastCheckin.checkedInAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}
