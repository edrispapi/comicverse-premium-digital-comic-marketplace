import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { api } from './lib/api-client';
import { AppFallback } from './components/AppFallback';
// Lazy load pages for better code splitting and initial load performance
const HomePage = React.lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const CatalogPage = React.lazy(() => import('@/pages/CatalogPage').then(module => ({ default: module.CatalogPage })));
const ProductPage = React.lazy(() => import('@/pages/ProductPage').then(module => ({ default: module.ProductPage })));
const AuthorsPage = React.lazy(() => import('@/pages/AuthorsPage').then(module => ({ default: module.AuthorsPage })));
const GenresPage = React.lazy(() => import('@/pages/GenresPage').then(module => ({ default: module.GenresPage })));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const AuthorDetailPage = React.lazy(() => import('@/pages/AuthorDetailPage').then(module => ({ default: module.AuthorDetailPage })));
const AudiobooksPage = React.lazy(() => import('@/pages/AudiobooksPage').then(module => ({ default: module.AudiobooksPage })));
const AudiobooksDetailPage = React.lazy(() => import('@/pages/AudiobooksDetailPage').then(module => ({ default: module.AudiobooksDetailPage })));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const LibraryPage = React.lazy(() => import('@/pages/LibraryPage').then(module => ({ default: module.LibraryPage })));
const queryClient = new QueryClient();
const rootLoader = async () => {
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ['comics'], queryFn: () => api('/api/comics') }),
    queryClient.prefetchQuery({ queryKey: ['genres'], queryFn: () => api('/api/genres') }),
    queryClient.prefetchQuery({ queryKey: ['authors'], queryFn: () => api('/api/authors') }),
  ]);
  return null;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
    loader: rootLoader,
  },
  {
    path: "/catalog",
    element: <CatalogPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/comic/:id",
    element: <ProductPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/authors",
    element: <AuthorsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/authors/:id",
    element: <AuthorDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/genres",
    element: <GenresPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/audiobooks",
    element: <AudiobooksPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/audiobooks/:id",
    element: <AudiobooksDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/library",
    element: <LibraryPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<AppFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)