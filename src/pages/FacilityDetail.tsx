import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { facilitiesAPI, bookingsAPI } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Users, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

import labImage from '@/assets/facility-lab.jpg';
import classroomImage from '@/assets/facility-classroom.jpg';
import gymImage from '@/assets/facility-gym.jpg';

interface Facility {
  id: string;
  name: string;
  type: string;
  building: string;
  floor: number;
  capacity: number;
  description: string;
}

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
}

const facilityImages: Record<string, string> = {
  LAB: labImage,
  CLASSROOM: classroomImage,
  SPORTS: gymImage,
  MEETING: classroomImage,
};

export default function FacilityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facilityRes, slotsRes] = await Promise.all([
          facilitiesAPI.getById(id!),
          facilitiesAPI.getSlots(id!),
        ]);
        setFacility(facilityRes.data);
        setSlots(slotsRes.data);
      } catch (error) {
        toast({
          title: 'Error loading facility',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleBook = async () => {
    if (!selectedSlot) {
      toast({
        title: 'Please select a time slot',
        variant: 'destructive',
      });
      return;
    }

    setBooking(true);
    try {
      await bookingsAPI.create({
        facilityId: id!,
        slotId: selectedSlot,
        purpose: purpose || undefined,
      });
      toast({
        title: 'Booking submitted',
        description: 'Your booking request is pending approval',
      });
      navigate('/my-bookings');
    } catch (error: any) {
      toast({
        title: 'Booking failed',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </>
    );
  }

  if (!facility) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Facility not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/facilities')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Facilities
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img
                  src={facilityImages[facility.type] || labImage}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{facility.name}</CardTitle>
                    <Badge variant="secondary">{facility.type}</Badge>
                  </div>
                  <CardDescription>{facility.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {facility.building}, Floor {facility.floor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {facility.capacity} people</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Book a Time Slot</CardTitle>
                  <CardDescription>Select an available slot to book this facility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Available Time Slots</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {slots.filter((slot) => slot.status === 'AVAILABLE').length === 0 ? (
                        <p className="text-sm text-muted-foreground">No available slots</p>
                      ) : (
                        slots
                          .filter((slot) => slot.status === 'AVAILABLE')
                          .map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedSlot(slot.id)}
                              className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                                selectedSlot === slot.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {format(new Date(slot.startTime), 'HH:mm')} -{' '}
                                    {format(new Date(slot.endTime), 'HH:mm')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(slot.startTime), 'MMM dd')}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="purpose">Purpose (Optional)</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Brief description of why you need this facility..."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    onClick={handleBook}
                    disabled={!selectedSlot || booking}
                    className="w-full"
                    size="lg"
                  >
                    {booking ? 'Submitting...' : 'Submit Booking Request'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
