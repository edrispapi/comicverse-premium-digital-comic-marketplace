import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Comic, Author, User, Genre } from '@shared/types';
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

export const useGenres = () => {
  return useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: () => api<Genre[]>('/api/genres'),
  });
};
// Mock login/register mutation
export const useAuth = () => {
    const queryClient = useQueryClient();
    return useMutation<{ user: User }, Error, { name: string }>({
        mutationFn: ({ name }) => api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ name }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });
};