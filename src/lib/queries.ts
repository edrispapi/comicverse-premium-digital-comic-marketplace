import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Comic, Author, User, Genre, AuthResponse } from '@shared/types';
// Fetch all comics
export const useComics = () => {
  return useQuery<Comic[]>({
    queryKey: ['comics'],
    queryFn: () => api<Comic[]>('/api/comics'),
  });
};
// Fetch a single comic by ID
export const useComic = (id: string | undefined) => {
  return useQuery<Comic>({
    queryKey: ['comic', id],
    queryFn: () => api<Comic>(`/api/comics/${id}`),
    enabled: !!id, // Only run the query if the id is not undefined
  });
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