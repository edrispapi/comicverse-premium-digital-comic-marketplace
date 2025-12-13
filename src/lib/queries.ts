import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Comic, Author, User, Genre, AuthResponse, UserStats, Notification, Comment, Post } from '@shared/types';
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
// Fetch all audiobooks
export const useAudiobooks = () => {
  return useQuery<Comic[]>({
    queryKey: ['audiobooks'],
    queryFn: () => api<Comic[]>('/api/audiobooks'),
  });
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
// Comic Comments & Ratings
export const useComicComments = (comicId?: string) => {
    return useQuery<Comment[]>({
        queryKey: ['comments', comicId],
        queryFn: () => api<Comment[]>(`/api/comics/${comicId}/comments`),
        enabled: !!comicId,
    });
};
export const useUpdateRating = (comicId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (rating: number) => api(`/api/comics/${comicId}/rating`, {
            method: 'PATCH',
            body: JSON.stringify({ rating }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comic', comicId] });
            queryClient.invalidateQueries({ queryKey: ['comics'] });
        },
    });
};
export const usePostComment = (comicId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (message: string) => api(`/api/comics/${comicId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', comicId] });
        },
    });
};
// Comic Posts
export const useComicPosts = (comicId?: string) => {
    return useQuery<Post[]>({
        queryKey: ['posts', comicId],
        queryFn: () => api<Post[]>(`/api/comics/${comicId}/posts`),
        enabled: !!comicId,
    });
};
export const usePostPost = (comicId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postData: { type: Post['type']; content: string }) => api(`/api/comics/${comicId}/posts`, {
            method: 'POST',
            body: JSON.stringify(postData),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', comicId] });
            queryClient.invalidateQueries({ queryKey: ['comic', comicId] });
            queryClient.invalidateQueries({ queryKey: ['comics'] });
        },
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