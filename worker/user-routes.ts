import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ComicEntity, AuthorEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // COMICS
  app.get('/api/comics', async (c) => {
    await ComicEntity.ensureSeed(c.env);
    const { items } = await ComicEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/comics/:id', async (c) => {
    const id = c.req.param('id');
    const comic = new ComicEntity(c.env, id);
    if (!await comic.exists()) return notFound(c, 'comic not found');
    return ok(c, await comic.getState());
  });
  // AUTHORS
  app.get('/api/authors', async (c) => {
    await AuthorEntity.ensureSeed(c.env);
    const { items } = await AuthorEntity.list(c.env);
    return ok(c, items);
  });
  // AUTH (Mock)
  app.post('/api/auth/login', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!isStr(name)) return bad(c, 'name required');
    // In a real app, you'd look up by a unique identifier like email
    // For this mock, we'll find or create by name
    const { items: existingUsers } = await UserEntity.list(c.env);
    let user = existingUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (!user) {
      user = await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() });
    }
    return ok(c, { user });
  });
  // USERS (for potential admin use, keeping simple)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page.items);
  });
}