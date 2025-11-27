import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, Clock, Shield } from 'lucide-react';
import heroImage from '@/assets/hero-campus.jpg';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold">UIT Facility Booking</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Book campus facilities with ease. From computer labs to sports facilities,
              reserve your space in just a few clicks.
            </p>
            <div className="flex gap-4">
              <Link to="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Facilities</h3>
              <p className="text-muted-foreground">
                Explore available facilities including labs, classrooms, and sports venues
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book a Time Slot</h3>
              <p className="text-muted-foreground">
                Select your preferred time slot and submit your booking request
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Approved & Check In</h3>
              <p className="text-muted-foreground">
                Wait for admin approval and receive your QR code for check-in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Admins Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">For Administrators</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Efficiently manage facility bookings with our admin dashboard. Review pending
              requests, approve or reject bookings, and track facility usage statistics.
            </p>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
