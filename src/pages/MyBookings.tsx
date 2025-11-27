import { useEffect, useState } from 'react';
import { bookingsAPI } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Clock, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// 🔹 Dùng thư viện qrcode để tạo ảnh QR (data URL)
import QRCode from 'qrcode';

interface Booking {
  id: string;
  purpose?: string;
  status: string;
  qrToken?: string;
  createdAt: string;
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

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  CHECKED_IN: 'bg-blue-500',
  CANCELED: 'bg-gray-500',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null); // 🔹 ảnh QR

  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data } = await bookingsAPI.getMyBookings();
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

  const handleCancel = async (id: string) => {
    try {
      await bookingsAPI.cancel(id);
      toast({
        title: 'Booking canceled',
        description: 'Your booking has been canceled',
      });
      fetchBookings();
    } catch (error: any) {
      toast({
        title: 'Cancelation failed',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  // 🔹 Tạo QR image từ token và mở dialog
  const showQRCode = async (token: string) => {
    try {
      const url = await QRCode.toDataURL(token, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setSelectedToken(token);
      setQrImage(url);
      setQrDialogOpen(true);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to generate QR code',
        description: 'Please try again',
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
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your facility bookings</p>
          </div>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No bookings yet</p>
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
                      <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                    {booking.purpose && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Purpose: {booking.purpose}
                      </p>
                    )}

                    <div className="flex gap-2">
                      {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                      {booking.status === 'APPROVED' && booking.qrToken && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showQRCode(booking.qrToken!)}
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          Show QR Code
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-in QR Code</DialogTitle>
            <DialogDescription>
              Show this code at the facility for check-in
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4 py-6">
            {qrImage && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                {/* Ảnh QR thật, không bị CSS theme ảnh hưởng */}
                <img
                  src={qrImage}
                  alt="Check-in QR code"
                  className="w-48 h-48"
                />
              </div>
            )}

            <p className="text-xs text-muted-foreground break-all text-center">
              QR Token: {selectedToken}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
