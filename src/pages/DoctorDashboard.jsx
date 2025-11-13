import DoctorSidebar from '../components/Sidebar.jsx';
import DashboardHome from '../components/DashboardHome.jsx';
import '../components/DoctorDashboard.css';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const renderView = () => {
    
     return <DashboardHome />;
    
  };


  return (
    <div className="layout-container"> {/* ✅ Flex layout for sidebar + content */}
      <DoctorSidebar
         activeView="patients"
         onSelect={(view) => {
           switch (view) {
             case 'home':
           navigate('/doctor');
               break;
             case 'patients':
               navigate('/patients');
               break;
             case 'settings':
              navigate('/settings');
             break;
             default:
               break;
         }
        }}
        />
      
    {/* <div className="dashboard-container">
      <DoctorSidebar onSelect={setView} /> */}
      <div className="main-content">
        {renderView()}
      </div>
    </div>
  
  );
};

export default DoctorDashboard;
