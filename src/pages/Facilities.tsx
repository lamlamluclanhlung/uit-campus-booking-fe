import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { facilitiesAPI } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  isActive: boolean;
}

const facilityImages: Record<string, string> = {
  LAB: labImage,
  CLASSROOM: classroomImage,
  SPORTS: gymImage,
  MEETING: classroomImage,
};

export default function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const { data } = await facilitiesAPI.getAll();
        setFacilities(data);
      } catch (error) {
        toast({
          title: 'Error loading facilities',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [toast]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading facilities...</div>
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
            <h1 className="text-3xl font-bold mb-2">Campus Facilities</h1>
            <p className="text-muted-foreground">Browse and book available facilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <Link key={facility.id} to={`/facilities/${facility.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={facilityImages[facility.type] || labImage}
                      alt={facility.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{facility.name}</CardTitle>
                      <Badge variant="secondary">{facility.type}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {facility.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {facility.building}, Floor {facility.floor}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {facility.capacity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
