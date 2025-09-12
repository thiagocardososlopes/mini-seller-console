import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { router } from './pages/routes.tsx';
import './index.css'
import { FilterProvider } from './context/FilterContext/provider.tsx';
import { DataProvider } from './context/DataContext/provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <FilterProvider>
        <RouterProvider router={router} />
      </FilterProvider>
    </DataProvider>
  </StrictMode>,
);
