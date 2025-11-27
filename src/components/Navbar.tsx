import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, LogOut, Calendar, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ĐỔI to="/" → to="/facilities" */}
          <Link to="/facilities" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">UIT Facility Booking</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <Link to="/facilities">
                <Button variant="ghost" size="sm">
                  <Building2 className="mr-2 h-4 w-4" />
                  Facilities
                </Button>
              </Link>
              
              {user.role === 'STUDENT' && (
                <Link to="/my-bookings">
                  <Button variant="ghost" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    My Bookings
                  </Button>
                </Link>
              )}
              
              {user.role === 'ADMIN' && (
                <Link to="/admin/approvals">
                  <Button variant="ghost" size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
