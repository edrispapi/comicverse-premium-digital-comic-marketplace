import type { User, Comic, Author, Genre } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const AUTHORS: Author[] = [
  { id: 'author-1', name: 'Stan Lee', avatarUrl: 'https://i.pravatar.cc/150?u=author-1', bio: 'An American comic book writer, editor, and publisher, widely regarded as one of the pioneers of the modern comic book industry.' },
  { id: 'author-2', name: 'Jack Kirby', avatarUrl: 'https://i.pravatar.cc/150?u=author-2', bio: 'An American comic book artist, writer, and editor, widely regarded as one of the medium\'s major innovators and one of its most prolific and influential creators.' },
  { id: 'author-3', name: 'Alan Moore', avatarUrl: 'https://i.pravatar.cc/150?u=author-3', bio: 'An English writer known primarily for his work in comic books including Watchmen, V for Vendetta, and From Hell.' },
  { id: 'author-4', name: 'Frank Miller', avatarUrl: 'https://i.pravatar.cc/150?u=author-4', bio: 'An American comic book writer, penciller and inker, novelist, screenwriter, film director, and producer known for his comic book stories and graphic novels such as Ronin, Daredevil: Born Again, The Dark Knight Returns, Sin City, and 300.' },
  { id: 'author-5', name: 'Hajime Isayama', avatarUrl: 'https://i.pravatar.cc/150?u=author-5', bio: 'A Japanese manga artist. His first and currently ongoing series, Attack on Titan, has sold over 100 million copies in print worldwide, making it one of the best-selling manga series of all time.' },
  { id: 'author-6', name: 'Neil Gaiman', avatarUrl: 'https://i.pravatar.cc/150?u=author-6', bio: 'An English author of short fiction, novels, comic books, graphic novels, nonfiction, audio theatre, and films. His work includes The Sandman comic book series.' },
];
export const GENRES: Genre[] = [
  { id: 'genre-1', name: 'Superhero' },
  { id: 'genre-2', name: 'Sci-Fi' },
  { id: 'genre-3', name: 'Fantasy' },
  { id: 'genre-4', name: 'Horror' },
  { id: 'genre-5', name: 'Manga' },
  { id: 'genre-6', name: 'Graphic Novel' },
  { id: 'genre-7', name: 'Noir' },
];
export const COMICS: Comic[] = [
  {
    id: 'comic-1',
    title: 'Cosmic Odyssey',
    description: 'A thrilling space opera that spans galaxies. Follow the crew of the Star-Wanderer as they uncover an ancient secret that could change the universe forever.',
    coverUrl: 'https://images.unsplash.com/photo-1581390114939-94659550642a?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-1', 'author-2'],
    genreIds: ['genre-1', 'genre-2'],
    price: 19.99,
    rating: 4.8,
    pages: 256,
    releaseDate: '2023-10-26',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=800&auto=format&fit=crop',
    ]
  },
  {
    id: 'comic-2',
    title: 'The Watchmen',
    description: 'In an alternate history where superheroes are treated as outlaws, a murder mystery uncovers a conspiracy that could doom the world.',
    coverUrl: 'https://images.unsplash.com/photo-1611433853149-9a3753993134?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-3'],
    genreIds: ['genre-1', 'genre-6'],
    price: 24.99,
    rating: 4.9,
    pages: 416,
    releaseDate: '1987-09-01',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1501494227293-a3321369ce3f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583342594622-28a126da99b8?q=80&w=800&auto=format&fit=crop',
    ]
  },
  {
    id: 'comic-3',
    title: 'Attack on Titan Vol. 1',
    description: 'In a world where humanity lives in cities surrounded by enormous walls, a young boy vows to exterminate the giant humanoids that threaten his home.',
    coverUrl: 'https://images.unsplash.com/photo-1608282132739-a6d5a456f621?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-5'],
    genreIds: ['genre-5', 'genre-4', 'genre-3'],
    price: 12.99,
    rating: 4.7,
    pages: 192,
    releaseDate: '2010-03-17',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596722833224-72a443535626?q=80&w=800&auto=format&fit=crop',
    ]
  },
  {
    id: 'comic-4',
    title: 'The Dark Knight Returns',
    description: 'A grizzled, middle-aged Bruce Wayne returns from retirement to fight crime in a dark and violent future, facing opposition from the Gotham City police force and the U.S. government.',
    coverUrl: 'https://images.unsplash.com/photo-1531259653400-3f5b78d11646?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-4'],
    genreIds: ['genre-1', 'genre-6', 'genre-7'],
    price: 21.50,
    rating: 4.9,
    pages: 224,
    releaseDate: '1986-02-01',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1561389739-8b6a546823b5?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547922495-2d5d3c1a9a32?q=80&w=800&auto=format&fit=crop',
    ]
  },
  {
    id: 'comic-5',
    title: 'Cybernetic Dawn',
    description: 'In a neon-drenched metropolis, a rogue android detective hunts for the truth behind her own creation, uncovering a corporate conspiracy.',
    coverUrl: 'https://images.unsplash.com/photo-1535378620244-27f774fbac06?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-1'],
    genreIds: ['genre-2', 'genre-7'],
    price: 15.99,
    rating: 4.5,
    pages: 180,
    releaseDate: '2024-01-15',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=800&auto=format&fit=crop',
    ]
  },
  {
    id: 'comic-6',
    title: 'Chronicles of Eldoria',
    description: 'A high-fantasy epic where a young elf must unite warring kingdoms against a shadow that threatens to consume the land.',
    coverUrl: 'https://images.unsplash.com/photo-1549212693-08367b2fe83b?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-3', 'author-6'],
    genreIds: ['genre-3'],
    price: 29.99,
    rating: 4.6,
    pages: 350,
    releaseDate: '2022-08-20',
    previewImageUrls: []
  },
  {
    id: 'comic-7',
    title: 'Void Echoes',
    description: 'A psychological horror story set on a derelict space station. The lone survivor must confront her inner demons and a terrifying presence.',
    coverUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-4'],
    genreIds: ['genre-4', 'genre-2'],
    price: 18.00,
    rating: 4.7,
    pages: 210,
    releaseDate: '2023-05-11',
    previewImageUrls: []
  },
  {
    id: 'comic-8',
    title: 'Blade of the Ronin',
    description: 'A lone samurai wanders a feudal Japan-inspired land, seeking redemption for his past while protecting the innocent from a corrupt shogun.',
    coverUrl: 'https://images.unsplash.com/photo-1591635503744-36a029a63e27?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-5'],
    genreIds: ['genre-5'],
    price: 14.99,
    rating: 4.8,
    pages: 200,
    releaseDate: '2021-11-30',
    previewImageUrls: []
  },
  {
    id: 'comic-9',
    title: 'The Sandman: Preludes',
    description: 'Journey into a world of dreams, myths, and nightmares as the lord of dreams, Morpheus, is captured and must reclaim his lost artifacts.',
    coverUrl: 'https://images.unsplash.com/photo-1544220854-53a0184357a1?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-6'],
    genreIds: ['genre-3', 'genre-6', 'genre-4'],
    price: 22.99,
    rating: 4.9,
    pages: 240,
    releaseDate: '1989-01-01',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=800&auto=format&fit=crop',
    ]
  },
];
export const genres = GENRES;
export const authors = AUTHORS;