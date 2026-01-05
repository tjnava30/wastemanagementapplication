import React from 'react';
import { useApp } from '../context/AppContext';
import { CitizenDashboard } from './dashboards/CitizenDashboard';
import { WorkerDashboard } from './dashboards/WorkerDashboard';
import { GovernmentDashboard } from './dashboards/GovernmentDashboard';
// You can create these components later for other roles
// import { AdminDashboard } from './AdminDashboard'; 
// import { GovernmentDashboard } from './GovernmentDashboard';

export function Dashboard() {
  const { user } = useApp();

  // This function checks the user's role and shows the correct dashboard
  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'citizen':
        return <CitizenDashboard />;
      case 'worker':
        return <WorkerDashboard />;
      case 'government':
        return <GovernmentDashboard />;
      // case 'admin':
      //   return <AdminDashboard />;
      // case 'government':
      //   return <GovernmentDashboard />;
      default:
        // Fallback for any unknown roles or if user is null
        return <div>No dashboard available for your role.</div>;
    }
  };

  return (
    <div>
      {renderDashboardByRole()}
    </div>
  );
}