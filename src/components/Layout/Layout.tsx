import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen font-sans">
        <Sidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

