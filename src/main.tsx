import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage';
import { ProductPage } from '@/pages/ProductPage';
import { AuthorsPage } from '@/pages/AuthorsPage';
import { GenresPage } from '@/pages/GenresPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AuthorDetailPage } from '@/pages/AuthorDetailPage';
import { AudiobooksPage } from '@/pages/AudiobooksPage';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
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
    path: "/checkout",
    element: <CheckoutPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)