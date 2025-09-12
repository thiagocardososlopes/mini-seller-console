import { NavLink } from 'react-router-dom';

import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Sidebar = () => {
  const baseLinkClass = "flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-secondary text-white";
  const inactiveLinkClass = "text-white/70 hover:bg-white/10 hover:text-white";

  return (
    <aside className="w-82 bg-secondary text-white flex flex-col p-4 shrink-0">
      
      <div className="flex items-center gap-3 p-3 mb-4">
        <DashboardIcon sx={{ fontSize: 32 }} />
        <h1 className="text-2xl font-bold">Mini Seller Console</h1>
      </div>

      <hr className="border-t border-white/20 my-2" />

      <nav className="flex-1">
        <ul>
          <li>
            <NavLink
              to="/leads"
              className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              <GroupIcon className="mr-3" />
              <span>Leads</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/opportunities"
              className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              <MonetizationOnIcon className="mr-3" />
              <span>Opportunities</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="mt-auto text-center text-xs text-white/50">
        <p>Developed by Thiago Cardoso</p>
      </div>
    </aside>
  );
};

export default Sidebar;
