import '../index.css';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, type JSX } from 'react';
import Layout from '../components/Layout/Layout.tsx';

const LeadsPage = lazy(() => import('./Leads/LeadsPage.tsx'));
const OpportunitiesPage = lazy(() => import('./Opportunities/OpportunitiesPage.tsx'));

const withSuspense = (Component: JSX.Element) => (
  <Suspense fallback={
    <div className="flex justify-center items-center h-full p-8">
      <p className="text-xl">Loading...</p>
    </div>
  }>{Component}</Suspense>
);


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/leads" replace /> },
      {
        path: 'leads',
        element: withSuspense(<LeadsPage />),
      },
      {
        path: 'opportunities',
        element: withSuspense(<OpportunitiesPage />),
      },
    ],
  },
]);
