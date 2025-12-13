import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Comic, Author, User, Genre, AuthResponse, UserStats, Notification } from '@shared/types';
import { useMemo } from 'react';
export interface PaginatedResponse<T> {
  items: T[];
  nextPage: number | null;
}
// Fetch all comics (paginated)
export const useComics = () => {
  return useQuery<PaginatedResponse<Comic>>({
    queryKey: ['comics'],
    queryFn: () => api<PaginatedResponse<Comic>>('/api/comics'),
  });
};
// Helper hook to get just the comic items array
export const useComicsItems = () => {
    const { data } = useComics();
    return useMemo(() => data?.items ?? [], [data]);
};
// Fetch a single comic by ID
export const useComic = (id: string | undefined) => {
  return useQuery<Comic>({
    queryKey: ['comic', id],
    queryFn: () => api<Comic>(`/api/comics/${id}`),
    enabled: !!id, // Only run the query if the id is not undefined
  });
};
// Fetch all audiobooks (paginated)
export const useAudiobooks = () => {
  return useQuery<PaginatedResponse<Comic>>({
    queryKey: ['audiobooks'],
    queryFn: () => api<PaginatedResponse<Comic>>('/api/audiobooks'),
  });
};
// Helper hook to get just the audiobook items array
export const useAudiobooksItems = () => {
    const { data } = useAudiobooks();
    return useMemo(() => data?.items ?? [], [data]);
};
// Fetch a single audiobook by ID
export const useAudiobook = (id: string | undefined) => {
  return useQuery<Comic>({
    queryKey: ['audiobook', id],
    queryFn: () => api<Comic>(`/api/audiobooks/${id}`),
    enabled: !!id,
  });
};
// Fetch new release audiobooks (returns an array directly)
export const useNewAudiobooks = () => {
  return useQuery<Comic[]>({
    queryKey: ['newAudiobooks'],
    queryFn: () => api<Comic[]>('/api/audiobooks/new'),
  });
};
// Helper hook for consistency
export const useNewAudiobooksItems = () => {
    const { data } = useNewAudiobooks();
    return useMemo(() => data ?? [], [data]);
};
// Fetch all authors
export const useAuthors = () => {
  return useQuery<Author[]>({
    queryKey: ['authors'],
    queryFn: () => api<Author[]>('/api/authors'),
  });
};
// Fetch a single author by ID
export const useAuthor = (id: string | undefined) => {
  return useQuery<Author>({
    queryKey: ['author', id],
    queryFn: () => api<Author>(`/api/authors/${id}`),
    enabled: !!id,
  });
};
export const useGenres = () => {
  return useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: () => api<Genre[]>('/api/genres'),
  });
};
// Auth mutations
export const useAuthLogin = () => {
    const queryClient = useQueryClient();
    return useMutation<AuthResponse, Error, { email: string; password: string }>({
        mutationFn: ({ email, password }) => api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });
};
export const useAuthSignup = () => {
    const queryClient = useQueryClient();
    return useMutation<AuthResponse, Error, { name: string; email: string; password: string }>({
        mutationFn: ({ name, email, password }) => api('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });
};
// User Stats & Notifications
export const useUserStats = () => {
    return useQuery<UserStats>({
        queryKey: ['userStats'],
        queryFn: () => api<UserStats>('/api/user/stats'),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
export const useUserNotifications = () => {
    return useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: () => api<Notification[]>('/api/notifications'),
    });
};