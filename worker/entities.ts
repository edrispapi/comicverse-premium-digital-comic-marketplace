import { IndexedEntity } from "./core-utils";
import type { User, Comic, Author, Genre } from "@shared/types";
import { MOCK_USERS, COMICS, AUTHORS, GENRES } from "@shared/mock-data";
// USER ENTITY
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", email: "", passwordHash: "" };
  static seedData = MOCK_USERS;
}
// AUTHOR ENTITY
export class AuthorEntity extends IndexedEntity<Author> {
  static readonly entityName = "author";
  static readonly indexName = "authors";
  static readonly initialState: Author = { id: "", name: "", avatarUrl: "", bio: "" };
  static seedData = AUTHORS;
}
// COMIC ENTITY
export class ComicEntity extends IndexedEntity<Comic> {
  static readonly entityName = "comic";
  static readonly indexName = "comics";
  static readonly initialState: Comic = {
    id: '',
    title: '',
    description: '',
    coverUrl: '',
    authorIds: [],
    genreIds: [],
    price: 0,
    rating: 0,
    pages: 0,
    releaseDate: '',
    previewImageUrls: [],
  };
  static seedData = COMICS;
}
// GENRE ENTITY
export class GenreEntity extends IndexedEntity<Genre> {
  static readonly entityName = 'genre';
  static readonly indexName = 'genres';
  static readonly initialState: Genre = { id: '', name: '' };
  static seedData = GENRES;
}