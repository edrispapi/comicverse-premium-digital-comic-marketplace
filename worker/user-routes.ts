import { Hono } from "hono";
import type { Env } from "./core-utils";
import { UserEntity, ComicEntity, AuthorEntity, GenreEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User, Notification, Comic, Comment, Post } from '@shared/types';
const mockHash = (password: string) => btoa(password);
const mockGenerateToken = (user: User) => JSON.stringify({ sub: user.id, name: user.name, iat: Date.now() });
const parseDuration = (durationStr: string | undefined): number => {
  if (!durationStr) return 0;
  const parts = durationStr.split(' ');
  const hours = parts[0] ? parseInt(parts[0].replace('h', '')) : 0;
  const minutes = parts[1] ? parseInt(parts[1].replace('m', '')) : 0;
  return hours + minutes / 60;
};
async function getFilteredComics(c: any) {
  await ComicEntity.ensureSeed(c.env);
  const { items: allComics } = await ComicEntity.list(c.env, null, 500);
  const search = c.req.query('q');
  const genres = c.req.query('genres');
  const authorIdsParam = c.req.query('authorIds');
  const priceMax = c.req.query('priceMax');
  const sort = c.req.query('sort') || 'newest';
  let filteredComics = allComics;
  if (search) {
    filteredComics = filteredComics.filter(comic => comic.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (genres) {
    const genreIds = genres.split(',').filter(Boolean);
    if (genreIds.length > 0) filteredComics = filteredComics.filter(comic => comic.genreIds.some(gid => genreIds.includes(gid)));
  }
  if (authorIdsParam) {
    const authorIds = authorIdsParam.split(',').filter(Boolean);
    if (authorIds.length > 0) filteredComics = filteredComics.filter(comic => comic.authorIds.some(aid => authorIds.includes(aid)));
  }
  if (priceMax) {
    filteredComics = filteredComics.filter(comic => comic.price <= parseFloat(priceMax));
  }
  if (sort === 'newest') filteredComics.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  else if (sort === 'popular' || sort === 'rating') filteredComics.sort((a, b) => (b.ratings?.avg ?? 0) - (a.ratings?.avg ?? 0));
  return filteredComics;
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // COMICS
  app.get('/api/comics', async (c) => {
    await ComicEntity.ensureSeed(c.env);
    const { items: allComics } = await ComicEntity.list(c.env, null, 500);
    return ok(c, allComics);
  });
  app.get('/api/search', async (c) => {
    const comics = await getFilteredComics(c);
    return ok(c, comics);
  });
  app.get('/api/comics/:id', async (c) => {
    const id = c.req.param('id');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    return ok(c, await comic.getState());
  });
  // COMIC COMMENTS
  app.get('/api/comics/:id/comments', async (c) => {
    const id = c.req.param('id');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const state = await comic.getState();
    return ok(c, (state.comments ?? []).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
  });
  app.post('/api/comics/:id/comments', async (c) => {
    const id = c.req.param('id');
    const { message } = (await c.req.json()) as { message?: string };
    if (!isStr(message)) return bad(c, 'Message is required');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const newComment: Comment = {
      id: crypto.randomUUID(),
      user: { name: 'MockUser', avatar: 'https://i.pravatar.cc/150?u=current-user' },
      message,
      time: new Date().toISOString(),
    };
    await comic.mutate(state => ({
      ...state,
      comments: [newComment, ...(state.comments ?? [])],
    }));
    return ok(c, newComment);
  });
  // COMIC POSTS
  app.get('/api/comics/:id/posts', async (c) => {
    const id = c.req.param('id');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const state = await comic.getState();
    return ok(c, (state.posts ?? []).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
  });
  app.post('/api/comics/:id/posts', async (c) => {
    const id = c.req.param('id');
    const { type, content } = (await c.req.json()) as { type?: Post['type'], content?: string };
    if (!type || !isStr(content)) return bad(c, 'Type and content are required');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const newPost: Post = {
      id: crypto.randomUUID(),
      user: { name: 'MockUser', avatar: 'https://i.pravatar.cc/150?u=current-user' },
      type,
      content,
      time: new Date().toISOString(),
      reactions: { votes: 0, stars: 0, up: 0, down: 0, emojis: {}, stickers: {}, heart: 0 },
      replies: [],
    };
    await comic.mutate(state => ({
      ...state,
      posts: [newPost, ...(state.posts ?? [])],
    }));
    return ok(c, newPost);
  });
  app.patch('/api/comics/:id/posts/:postId/vote', async (c) => {
    const id = c.req.param('id');
    const postId = c.req.param('postId');
    const { up } = (await c.req.json()) as { up?: boolean };
    if (typeof up !== 'boolean') return bad(c, 'up:boolean is required');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const updatedState = await comic.mutate(s => {
      const postIndex = s.posts?.findIndex(p => p.id === postId);
      if (postIndex === -1 || !s.posts) return s;
      const post = s.posts[postIndex];
      const newReactions = { ...post.reactions, votes: post.reactions.votes + 1, up: post.reactions.up + (up ? 1 : 0), down: post.reactions.down + (!up ? 1 : 0) };
      const newPosts = [...s.posts];
      newPosts[postIndex] = { ...post, reactions: newReactions };
      return { ...s, posts: newPosts };
    });
    const updatedPost = updatedState.posts?.find(p => p.id === postId);
    return ok(c, updatedPost?.reactions);
  });
  app.patch('/api/comics/:id/posts/:postId/react', async (c) => {
    const id = c.req.param('id');
    const postId = c.req.param('postId');
    const { sticker } = (await c.req.json()) as { sticker?: string };
    if (!isStr(sticker)) return bad(c, 'sticker:string is required');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const updatedState = await comic.mutate(s => {
        const postIndex = s.posts?.findIndex(p => p.id === postId);
        if (postIndex === -1 || !s.posts) return s;
        const post = s.posts[postIndex];
        const newStickers = { ...post.reactions.stickers };
        newStickers[sticker] = (newStickers[sticker] || 0) + 1;
        const newReactions = { ...post.reactions, stickers: newStickers };
        const newPosts = [...s.posts];
        newPosts[postIndex] = { ...post, reactions: newReactions };
        return { ...s, posts: newPosts };
    });
    const updatedPost = updatedState.posts?.find(p => p.id === postId);
    return ok(c, updatedPost?.reactions);
  });
  app.post('/api/comics/:id/posts/:postId/reply', async (c) => {
    const id = c.req.param('id');
    const postId = c.req.param('postId');
    const { message } = (await c.req.json()) as { message?: string };
    if (!isStr(message)) return bad(c, 'Message is required');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const newReply: Comment = { id: crypto.randomUUID(), user: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=you' }, message, time: new Date().toISOString() };
    const updatedState = await comic.mutate(s => {
      const postIndex = s.posts?.findIndex(p => p.id === postId);
      if (postIndex === -1 || !s.posts) return s;
      const post = s.posts[postIndex];
      const newReplies = [newReply, ...(post.replies || [])];
      const newPosts = [...s.posts];
      newPosts[postIndex] = { ...post, replies: newReplies };
      return { ...s, posts: newPosts };
    });
    return ok(c, newReply);
  });
  app.patch('/api/comics/:id/posts/:postId/heart', async (c) => {
    const id = c.req.param('id');
    const postId = c.req.param('postId');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const updatedState = await comic.mutate(s => {
      const postIndex = s.posts?.findIndex(p => p.id === postId);
      if (postIndex === -1 || !s.posts) return s;
      const post = s.posts[postIndex];
      const newReactions = { ...post.reactions, heart: (post.reactions.heart || 0) + 1 };
      const newPosts = [...s.posts];
      newPosts[postIndex] = { ...post, reactions: newReactions };
      return { ...s, posts: newPosts };
    });
    const updatedPost = updatedState.posts?.find(p => p.id === postId);
    return ok(c, updatedPost?.reactions);
  });
  app.patch('/api/comics/:id/awards', async (c) => {
    const id = c.req.param('id');
    const { award } = (await c.req.json()) as { award?: string };
    if (!isStr(award)) return bad(c, 'Award is required');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const updatedState = await comic.mutate(s => {
      const newAwards = [...new Set([...(s.awards || []), award])];
      return { ...s, awards: newAwards };
    });
    return ok(c, updatedState);
  });
  // COMIC RATING
  app.patch('/api/comics/:id/rating', async (c) => {
    const id = c.req.param('id');
    const { rating } = (await c.req.json()) as { rating?: number };
    if (typeof rating !== 'number' || rating < 1 || rating > 5) return bad(c, 'Valid rating (1-5) is required');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    const updatedState = await comic.mutate(state => {
      const currentRatings = state.ratings ?? { avg: 0, votes: 0, up: 0, down: 0 };
      const oldAvg = currentRatings.avg;
      const oldVotes = currentRatings.votes;
      const newVotes = oldVotes + 1;
      const newAvg = (oldAvg * oldVotes + rating) / newVotes;
      return { ...state, ratings: { ...currentRatings, avg: parseFloat(newAvg.toFixed(1)), votes: newVotes, up: currentRatings.up + (rating >= 3 ? 1 : 0), down: currentRatings.down + (rating < 3 ? 1 : 0) } };
    });
    return ok(c, updatedState.ratings);
  });
  // AUDIOBOOKS
  app.get('/api/audiobooks', async (c) => { await ComicEntity.ensureSeed(c.env); const { items: allComics } = await ComicEntity.list(c.env, null, 100); let audiobooks = allComics.filter(comic => comic.audioUrl); const search = c.req.query('search'); if (search) { audiobooks = audiobooks.filter(a => a.title.toLowerCase().includes(search.toLowerCase())); } return ok(c, audiobooks); });
  app.get('/api/audiobooks/new', async (c) => { await ComicEntity.ensureSeed(c.env); const { items } = await ComicEntity.list(c.env, null, 100); const audiobooks = items.filter(comic => comic.audioUrl); const newReleases = audiobooks.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 5); return ok(c, newReleases); });
  app.get('/api/audiobooks/:id', async (c) => { const id = c.req.param('id'); const comic = new ComicEntity(c.env, id); if (!await comic.exists()) return notFound(c, 'audiobook not found'); const data = await comic.getState(); if (!data.audioUrl) return notFound(c, 'audiobook not found'); return ok(c, data); });
  // AUTHORS & GENRES
  app.get('/api/authors', async (c) => { await AuthorEntity.ensureSeed(c.env); const { items } = await AuthorEntity.list(c.env, null, 50); return ok(c, items); });
  app.get('/api/authors/:id', async (c) => { const id = c.req.param('id'); const author = new AuthorEntity(c.env, id); if (!await author.exists()) return notFound(c, 'author not found'); return ok(c, await author.getState()); });
  app.get('/api/genres', async (c) => { await GenreEntity.ensureSeed(c.env); const { items } = await GenreEntity.list(c.env, null, 50); return ok(c, items); });
  app.get('/api/genres/:id', async (c) => { const id = c.req.param('id'); const genre = new GenreEntity(c.env, id); if (!await genre.exists()) return notFound(c, 'genre not found'); return ok(c, await genre.getState()); });
  // USER STATS & NOTIFICATIONS
  app.get('/api/user/stats', async (c) => { const stats = { reads: Math.floor(20 + Math.random() * 30), hours: Math.floor(40 + Math.random() * 60), spent: parseFloat((120 + Math.random() * 400).toFixed(2)), }; return ok(c, stats); });
  app.get('/api/notifications', async (c) => { const notifications: Notification[] = [ { id: crypto.randomUUID(), type: 'release', title: 'New Release: Cosmic Odyssey Vol. 2!', date: new Date(Date.now() - 86400000).toISOString(), read: false }, { id: crypto.randomUUID(), type: 'promo', title: 'Weekend Sale: 20% off all Superhero comics!', date: new Date(Date.now() - 2 * 86400000).toISOString(), read: false }, ]; return ok(c, notifications); });
  // AUTH
  app.post('/api/auth/login', async (c) => { const { email, password } = (await c.req.json()) as { email?: string, password?: string }; if (!isStr(email) || !isStr(password)) return bad(c, 'Email and password required'); await UserEntity.ensureSeed(c.env); const { items: allUsers } = await UserEntity.list(c.env, null, 1000); const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase()); if (!user || user.passwordHash !== mockHash(password)) { return c.json({ success: false, error: 'Invalid credentials' }, 401); } const token = mockGenerateToken(user); const { passwordHash, ...userResponse } = user; return ok(c, { user: userResponse, token }); });
  app.post('/api/auth/signup', async (c) => { const { name, email, password } = (await c.req.json()) as { name?: string, email?: string, password?: string }; if (!isStr(name) || !isStr(email) || !isStr(password)) return bad(c, 'Name, email, and password required'); await UserEntity.ensureSeed(c.env); const { items: allUsers } = await UserEntity.list(c.env, null, 1000); if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) { return c.json({ success: false, error: 'An account with this email already exists' }, 409); } const newUser: User = { id: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), passwordHash: mockHash(password), pts: 0, awards: [], libraryUnlocked: {} }; await UserEntity.create(c.env, newUser); const token = mockGenerateToken(newUser); const { passwordHash, ...userResponse } = newUser; return ok(c, { user: userResponse, token }); });
  // ORDERS
  app.post('/api/orders', async (c) => {
    const { items, total } = (await c.req.json()) as { items: any[], total: number };
    const orderId = crypto.randomUUID();
    console.log(`[MOCK] Order received: ${orderId} for $${total.toFixed(2)} with ${items.length} items.`);
    return ok(c, { id: orderId, total });
  });
}