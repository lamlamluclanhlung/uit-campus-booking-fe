import { useEffect, useState } from 'react';
import { adminAPI } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Clock, User, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  purpose?: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  facility: {
    name: string;
    type: string;
    building: string;
  };
  slot: {
    startTime: string;
    endTime: string;
  };
}

export default function Approvals() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data } = await adminAPI.getPendingBookings();
      setBookings(data);
    } catch (error) {
      toast({
        title: 'Error loading bookings',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approveBooking(id);
      toast({
        title: 'Booking approved',
        description: 'Student has been notified',
      });
      fetchBookings();
    } catch (error: any) {
      toast({
        title: 'Approval failed',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminAPI.rejectBooking(id);
      toast({
        title: 'Booking rejected',
        description: 'Student has been notified',
      });
      fetchBookings();
    } catch (error: any) {
      toast({
        title: 'Rejection failed',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading bookings...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage facility bookings and check-ins</p>
          </div>

          <Tabs defaultValue="approvals" className="space-y-6">
            <TabsList>
              <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
              <TabsTrigger value="checkin" asChild>
                <Link to="/admin/checkins">Check-in</Link>
              </TabsTrigger>
              <TabsTrigger value="reports" asChild>
                <Link to="/admin/reports">Reports</Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approvals" className="space-y-4">
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">No pending bookings</p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {booking.facility.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {booking.facility.building} • {booking.facility.type}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{booking.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{booking.user.name}</p>
                            <p className="text-muted-foreground">{booking.user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(booking.slot.startTime), 'PPP')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(new Date(booking.slot.startTime), 'HH:mm')} -{' '}
                              {format(new Date(booking.slot.endTime), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {booking.purpose && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Purpose:</p>
                          <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(booking.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(booking.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
