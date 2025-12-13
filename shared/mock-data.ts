import type { User, Comic, Author, Genre } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A', email: 'user.a@example.com', passwordHash: 'cGFzc3dvcmQxMjM=' }, // password123
  { id: 'u2', name: 'User B', email: 'user.b@example.com', passwordHash: 'cGFzc3dvcmQ0NTY=' }  // password456
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
const chapterTitles = ['The Awakening', 'First Contact', 'The Conspiracy', 'Betrayal', 'The Siege', 'Turning Point', 'Revelation', 'Final Battle', 'Epilogue', 'New Beginning'];
const generateChapters = (comicId: string) => {
  const numChapters = 10 + Math.floor(Math.random() * 11); // 10 to 20 chapters
  return Array.from({ length: numChapters }).map((_, i) => ({
    id: `ch-${comicId}-${i + 1}`,
    title: `Chapter ${i + 1}: ${chapterTitles[i % chapterTitles.length]}`,
    progress: Math.floor(Math.random() * 101),
  }));
};
export const COMICS: Comic[] = [
  {
    id: 'comic-1',
    title: 'Cosmic Odyssey',
    description: 'A thrilling space opera that spans galaxies. Follow the crew of the Star-Wanderer as they uncover an ancient secret that could change the universe forever. This epic tale combines stunning visuals with a deep, character-driven narrative that explores themes of destiny, sacrifice, and the nature of consciousness itself. Prepare for a journey to the edge of imagination.',
    coverUrl: 'https://images.unsplash.com/photo-1570525054547-96792e75bfe9?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-1', 'author-2'],
    genreIds: ['genre-1', 'genre-2'],
    price: 19.99,
    rating: 4.8,
    pages: 256,
    releaseDate: '2023-10-26',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1583305911787-57d1699511d0?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1573149760704-2ca0e3e26a5c?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-1'),
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
  },
  {
    id: 'comic-2',
    title: 'The Watchmen',
    description: 'In an alternate history where superheroes are treated as outlaws, a murder mystery uncovers a conspiracy that could doom the world. This seminal work deconstructs the superhero genre, offering a gritty, realistic take on what it would mean for costumed vigilantes to exist in the real world. Its complex narrative and mature themes have made it a cornerstone of the graphic novel medium.',
    coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7278b66?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-3'],
    genreIds: ['genre-1', 'genre-6'],
    price: 24.99,
    rating: 4.9,
    pages: 416,
    releaseDate: '1987-09-01',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1579586140626-00343dce9a8f?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1602080859398-9feefe2603e2?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-2'),
    audioUrl: 'https://www.soundjay.com/misc/sounds/dream-harp-01.mp3',
  },
  {
    id: 'comic-3',
    title: 'Attack on Titan Vol. 1',
    description: 'In a world where humanity lives in cities surrounded by enormous walls, a young boy vows to exterminate the giant humanoids that threaten his home. This manga series is known for its intense action, shocking plot twists, and exploration of themes like freedom, despair, and the horrors of war. It has captivated audiences worldwide and become a global phenomenon.',
    coverUrl: 'https://images.unsplash.com/photo-1588195535121-8b9b3e1e75cb?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-5'],
    genreIds: ['genre-5', 'genre-4', 'genre-3'],
    price: 12.99,
    rating: 4.7,
    pages: 192,
    releaseDate: '2010-03-17',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1541680991494-b62309e0e7c3?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1601001518984-fbc4f25e9e8d?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-3'),
  },
  {
    id: 'comic-4',
    title: 'The Dark Knight Returns',
    description: 'A grizzled, middle-aged Bruce Wayne returns from retirement to fight crime in a dark and violent future, facing opposition from the Gotham City police force and the U.S. government. This landmark story redefined Batman for a new generation, presenting a darker, more complex version of the character and influencing countless comics and films that followed.',
    coverUrl: 'https://images.unsplash.com/photo-1624306830531-3d8501883177?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-4'],
    genreIds: ['genre-1', 'genre-6', 'genre-7'],
    price: 21.50,
    rating: 4.9,
    pages: 224,
    releaseDate: '1986-02-01',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570525054547-96792e75bfe9?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-4'),
    audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chime-1.mp3',
  },
  {
    id: 'comic-5',
    title: 'Cybernetic Dawn',
    description: 'In a neon-drenched metropolis, a rogue android detective hunts for the truth behind her own creation, uncovering a corporate conspiracy. This cyberpunk thriller blends high-octane action with philosophical questions about identity and humanity in a technologically advanced world. The stunning artwork brings the futuristic city to life in vivid detail.',
    coverUrl: 'https://images.unsplash.com/photo-1583305911787-57d1699511d0?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-1'],
    genreIds: ['genre-2', 'genre-7'],
    price: 15.99,
    rating: 4.5,
    pages: 180,
    releaseDate: '2024-01-15',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-5'),
    audioUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3',
  },
  {
    id: 'comic-6',
    title: 'Chronicles of Eldoria',
    description: 'A high-fantasy epic where a young elf must unite warring kingdoms against a shadow that threatens to consume the land. Featuring a sprawling world, a rich history, and a diverse cast of characters, this series is a must-read for fans of classic fantasy. The journey is filled with magic, monsters, and political intrigue.',
    coverUrl: 'https://images.unsplash.com/photo-1573149760704-2ca0e3e26a5c?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-3', 'author-6'],
    genreIds: ['genre-3'],
    price: 29.99,
    rating: 4.6,
    pages: 350,
    releaseDate: '2022-08-20',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1583305911787-57d1699511d0?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507842217343-583bb7278b66?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-6'),
  },
  {
    id: 'comic-7',
    title: 'Void Echoes',
    description: 'A psychological horror story set on a derelict space station. The lone survivor must confront her inner demons and a terrifying presence. This comic masterfully blends science fiction with cosmic horror, creating a tense and atmospheric experience that will linger with you long after you finish reading. The art perfectly captures the sense of isolation and dread.',
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-4'],
    genreIds: ['genre-4', 'genre-2'],
    price: 18.00,
    rating: 4.7,
    pages: 210,
    releaseDate: '2023-05-11',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1579586140626-00343dce9a8f?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1602080859398-9feefe2603e2?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-7'),
    audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chime-2.mp3',
  },
  {
    id: 'comic-8',
    title: 'Blade of the Ronin',
    description: 'A lone samurai wanders a feudal Japan-inspired land, seeking redemption for his past while protecting the innocent from a corrupt shogun. This manga is a beautifully drawn tale of honor, revenge, and redemption. The sword fights are dynamic and visceral, and the story is a poignant exploration of the samurai code in a changing world.',
    coverUrl: 'https://images.unsplash.com/photo-1541680991494-b62309e0e7c3?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-5'],
    genreIds: ['genre-5'],
    price: 14.99,
    rating: 4.8,
    pages: 200,
    releaseDate: '2021-11-30',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1601001518984-fbc4f25e9e8d?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-8'),
  },
  {
    id: 'comic-9',
    title: 'The Sandman: Preludes',
    description: 'Journey into a world of dreams, myths, and nightmares as the lord of dreams, Morpheus, is captured and must reclaim his lost artifacts. This series is a masterpiece of modern fantasy, weaving together mythology, folklore, and history into a rich and intricate tapestry. It is a story about stories, and its influence on the comic book medium is immeasurable.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800&auto=format&fit=crop',
    authorIds: ['author-6'],
    genreIds: ['genre-3', 'genre-6', 'genre-4'],
    price: 22.99,
    rating: 4.9,
    pages: 240,
    releaseDate: '1989-01-01',
    previewImageUrls: [
        'https://images.unsplash.com/photo-1570525054547-96792e75bfe9?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583305911787-57d1699511d0?q=80&w=400&auto=format&fit=crop',
    ],
    chapters: generateChapters('comic-9'),
    audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chime-3.mp3',
  },
];
export const genres = GENRES;
export const authors = AUTHORS;
export const comics = COMICS;
export const audiobooks = COMICS.filter(c => c.audioUrl);