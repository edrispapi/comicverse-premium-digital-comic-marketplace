import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ComicEntity, AuthorEntity, GenreEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User, Notification, Comic } from '@shared/types';
const mockHash = (password: string) => btoa(password);
const mockGenerateToken = (user: User) => JSON.stringify({ sub: user.id, name: user.name, iat: Date.now() });
const parseDuration = (durationStr: string | undefined): number => {
  if (!durationStr) return 0;
  const parts = durationStr.split(' ');
  const hours = parts[0] ? parseInt(parts[0].replace('h', '')) : 0;
  const minutes = parts[1] ? parseInt(parts[1].replace('m', '')) : 0;
  return hours + minutes / 60;
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // COMICS
  app.get('/api/comics', async (c) => {
    await ComicEntity.ensureSeed(c.env);
    const { items: allComics } = await ComicEntity.list(c.env, null, 500);
    const search = c.req.query('search');
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
      if (genreIds.length > 0) {
        filteredComics = filteredComics.filter(comic => comic.genreIds.some(gid => genreIds.includes(gid)));
      }
    }
    if (authorIdsParam) {
      const authorIds = authorIdsParam.split(',').filter(Boolean);
      if (authorIds.length > 0) {
        filteredComics = filteredComics.filter(comic => comic.authorIds.some(aid => authorIds.includes(aid)));
      }
    }
    if (priceMax) {
      filteredComics = filteredComics.filter(comic => comic.price <= parseFloat(priceMax));
    }
    if (sort === 'newest') {
      filteredComics.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    } else if (sort === 'popular' || sort === 'rating') {
      filteredComics.sort((a, b) => b.rating - a.rating);
    }
    const page = parseInt(c.req.query('page') || '0');
    const limit = parseInt(c.req.query('limit') || '12');
    const start = page * limit;
    const end = start + limit;
    const paginatedItems = filteredComics.slice(start, end);
    const nextPage = end < filteredComics.length ? page + 1 : null;
    return ok(c, { items: paginatedItems, nextPage });
  });
  app.get('/api/comics/:id', async (c) => {
    const id = c.req.param('id');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    return ok(c, await comic.getState());
  });
  // AUDIOBOOKS
  app.get('/api/audiobooks', async (c) => {
    await ComicEntity.ensureSeed(c.env);
    const { items: allComics } = await ComicEntity.list(c.env, null, 100);
    let audiobooks = allComics.filter(comic => comic.audioUrl);
    // Filtering
    const search = c.req.query('search');
    const genres = c.req.query('genres');
    const priceMax = c.req.query('priceMax');
    const durationMax = c.req.query('durationMax');
    if (search) {
      audiobooks = audiobooks.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (genres) {
      const genreIds = genres.split(',');
      audiobooks = audiobooks.filter(a => a.genreIds.some(gid => genreIds.includes(gid)));
    }
    if (priceMax) {
      audiobooks = audiobooks.filter(a => a.price <= parseFloat(priceMax));
    }
    if (durationMax) {
      audiobooks = audiobooks.filter(a => parseDuration(a.duration) <= parseFloat(durationMax));
    }
    // Pagination
    const page = parseInt(c.req.query('page') || '0');
    const limit = parseInt(c.req.query('limit') || '10');
    const start = page * limit;
    const end = start + limit;
    const paginatedItems = audiobooks.slice(start, end);
    const nextPage = end < audiobooks.length ? page + 1 : null;
    return ok(c, { items: paginatedItems, nextPage });
  });
  app.get('/api/audiobooks/new', async (c) => {
    await ComicEntity.ensureSeed(c.env);
    const { items } = await ComicEntity.list(c.env, null, 100);
    const audiobooks = items.filter(comic => comic.audioUrl);
    const newReleases = audiobooks
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
      .slice(0, 5);
    return ok(c, newReleases);
  });
  app.get('/api/audiobooks/:id', async (c) => {
    const id = c.req.param('id');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'audiobook not found');
    const data = await comic.getState();
    if (!data.audioUrl) return notFound(c, 'audiobook not found');
    return ok(c, data);
  });
  // AUTHORS
  app.get('/api/authors', async (c) => {
    await AuthorEntity.ensureSeed(c.env);
    const { items } = await AuthorEntity.list(c.env, null, 50);
    return ok(c, items);
  });
  app.get('/api/authors/:id', async (c) => {
    const id = c.req.param('id');
    const author = new AuthorEntity(c.env, id);
    if (!await author.exists()) return notFound(c, 'author not found');
    return ok(c, await author.getState());
  });
  // GENRES
  app.get('/api/genres', async (c) => {
    await GenreEntity.ensureSeed(c.env);
    const { items } = await GenreEntity.list(c.env, null, 50);
    return ok(c, items);
  });
  // USER STATS & NOTIFICATIONS
  app.get('/api/user/stats', async (c) => {
    const stats = {
      reads: Math.floor(20 + Math.random() * 30),
      hours: Math.floor(40 + Math.random() * 60),
      spent: parseFloat((120 + Math.random() * 400).toFixed(2)),
    };
    return ok(c, stats);
  });
  app.get('/api/notifications', async (c) => {
    const notifications: Notification[] = [
      { id: crypto.randomUUID(), type: 'release', title: 'New Release: Cosmic Odyssey Vol. 2!', date: new Date(Date.now() - 86400000).toISOString(), read: false },
      { id: crypto.randomUUID(), type: 'promo', title: 'Weekend Sale: 20% off all Superhero comics!', date: new Date(Date.now() - 2 * 86400000).toISOString(), read: false },
      { id: crypto.randomUUID(), type: 'system', title: 'Welcome to the new dashboard!', date: new Date(Date.now() - 3 * 86400000).toISOString(), read: true },
      { id: crypto.randomUUID(), type: 'release', title: 'The Sandman: Act III is now available as an audiobook.', date: new Date(Date.now() - 5 * 86400000).toISOString(), read: true },
    ];
    return ok(c, notifications);
  });
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { email, password } = (await c.req.json()) as { email?: string, password?: string };
    if (!isStr(email) || !isStr(password)) return bad(c, 'Email and password required');
    await UserEntity.ensureSeed(c.env);
    const { items: allUsers } = await UserEntity.list(c.env, null, 1000);
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== mockHash(password)) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }
    const token = mockGenerateToken(user);
    const { passwordHash, ...userResponse } = user;
    return ok(c, { user: userResponse, token });
  });
  app.post('/api/auth/signup', async (c) => {
    const { name, email, password } = (await c.req.json()) as { name?: string, email?: string, password?: string };
    if (!isStr(name) || !isStr(email) || !isStr(password)) return bad(c, 'Name, email, and password required');
    await UserEntity.ensureSeed(c.env);
    const { items: allUsers } = await UserEntity.list(c.env, null, 1000);
    const existingUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return c.json({ success: false, error: 'An account with this email already exists' }, 409);
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: mockHash(password),
    };
    await UserEntity.create(c.env, newUser);
    const token = mockGenerateToken(newUser);
    const { passwordHash, ...userResponse } = newUser;
    return ok(c, { user: userResponse, token });
  });
  // USERS (for potential admin use, keeping simple)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const { items } = await UserEntity.list(c.env, null, 50);
    return ok(c, items);
  });
}