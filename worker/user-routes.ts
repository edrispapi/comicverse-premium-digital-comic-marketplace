import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ComicEntity, AuthorEntity, GenreEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User } from '@shared/types';
const mockHash = (password: string) => btoa(password);
const mockGenerateToken = (user: User) => JSON.stringify({ sub: user.id, name: user.name, iat: Date.now() });
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // COMICS
  app.get('/api/comics', async (c) => {
    await ComicEntity.ensureSeed(c.env);
    const { items } = await ComicEntity.list(c.env, null, 50);
    return ok(c, items);
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
    const { items } = await ComicEntity.list(c.env, null, 100);
    return ok(c, items.filter(comic => comic.audioUrl));
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