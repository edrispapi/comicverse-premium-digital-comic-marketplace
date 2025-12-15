import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from "@/lib/api-client";
import { Comic, Author, User, Genre, AuthResponse, UserStats, Notification, Comment, Post, PaginatedResponse } from '@shared/types';
// Fetch all comics (paginated)
export const useComics = () => {
  return useQuery<PaginatedResponse<Comic>>({
    queryKey: ['comics'],
    queryFn: () => api<PaginatedResponse<Comic>>('/api/comics?limit=500'),
  });
};
// Infinite scroll for comics
export const useInfiniteComics = (filters: object) => {
  return useInfiniteQuery<PaginatedResponse<Comic>, Error>({
    queryKey: ['comics-infinite', filters],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams();
      if (pageParam) {
        params.set('cursor', pageParam as string);
      }
      params.set('limit', '8');
      return api<PaginatedResponse<Comic>>(`/api/comics?${params.toString()}`);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
};
// Search comics
export const useSearchResults = (params: { q?: string; genres?: string[]; authorIds?: string[]; priceMax?: number; sort?: string }, enabled: boolean) => {
  const queryKey = ['searchResults', params];
  return useQuery<Comic[]>({
    queryKey,
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.set('q', params.q);
      if (params.genres && params.genres.length > 0) searchParams.set('genres', params.genres.join(','));
      if (params.authorIds && params.authorIds.length > 0) searchParams.set('authorIds', params.authorIds.join(','));
      if (params.priceMax) searchParams.set('priceMax', params.priceMax.toString());
      if (params.sort) searchParams.set('sort', params.sort);
      return api<Comic[]>(`/api/search?${searchParams.toString()}`);
    },
    enabled,
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
export const useVotePost = (comicId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, up }: { postId: string; up: boolean }) => api(`/api/comics/${comicId}/posts/${postId}/vote`, {
            method: 'PATCH',
            body: JSON.stringify({ up }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', comicId] });
            queryClient.invalidateQueries({ queryKey: ['comic', comicId] });
            queryClient.invalidateQueries({ queryKey: ['comics'] });
        },
    });
};
export const useReactToPost = (comicId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, sticker }: { postId: string; sticker: string }) => api(`/api/comics/${comicId}/posts/${postId}/react`, {
            method: 'PATCH',
            body: JSON.stringify({ sticker }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', comicId] });
            queryClient.invalidateQueries({ queryKey: ['comic', comicId] });
            queryClient.invalidateQueries({ queryKey: ['comics'] });
        },
    });
};
export const usePostReply = (comicId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, message }: { postId: string; message: string }) => api(`/api/comics/${comicId}/posts/${postId}/reply`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', comicId] });
        },
    });
};
export const useHeartPost = (comicId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId }: { postId: string }) => api(`/api/comics/${comicId}/posts/${postId}/heart`, {
            method: 'PATCH',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', comicId] });
        },
    });
};
export const useAwardComic = (comicId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ award }: { award: string }) => api(`/api/comics/${comicId}/awards`, {
            method: 'PATCH',
            body: JSON.stringify({ award }),
        }),
        onSuccess: () => {
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
// User Data
export const useUsers = () => {
    return useQuery<{id: string, name: string}[]>({
        queryKey: ['users'],
        queryFn: () => api('/api/users'),
    });
};
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
// Checkout & Gifting
export const usePlaceOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ items, total }: { items: any[], total: number }) => api('/api/orders', {
            method: 'POST',
            body: JSON.stringify({ items, total }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};
export const useGiftComic = (comicId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({toUserId}: {toUserId: string}) => api(`/api/comics/${comicId}/gift`, { method: 'PATCH', body: JSON.stringify({toUserId}) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comic', comicId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};