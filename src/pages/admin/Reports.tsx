import { useEffect, useState } from 'react';
import { adminAPI } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

interface ReportData {
  totalBookings: number;
  totalApproved: number;
  totalCheckedIn: number;
  byFacility: Array<{
    facilityName: string;
    count: number;
  }>;
}

export default function Reports() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data: reportData } = await adminAPI.getSummary();
        setData(reportData);
      } catch (error) {
        toast({
          title: 'Error loading reports',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [toast]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading reports...</div>
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
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">View booking statistics and facility usage</p>
          </div>

          <Tabs defaultValue="reports" className="space-y-6">
            <TabsList>
              <TabsTrigger value="approvals" asChild>
                <Link to="/admin/approvals">Pending Approvals</Link>
              </TabsTrigger>
              <TabsTrigger value="checkin" asChild>
                <Link to="/admin/checkins">Check-in</Link>
              </TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.totalBookings || 0}</div>
                  <p className="text-xs text-muted-foreground">All time bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.totalApproved || 0}</div>
                  <p className="text-xs text-muted-foreground">Approved bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.totalCheckedIn || 0}</div>
                  <p className="text-xs text-muted-foreground">Completed check-ins</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bookings by Facility</CardTitle>
                <CardDescription>Distribution of bookings across facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.byFacility && data.byFacility.length > 0 ? (
                    data.byFacility.map((facility, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{facility.facilityName}</span>
                        </div>
                        <span className="text-2xl font-bold">{facility.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No booking data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </>
  );
}
