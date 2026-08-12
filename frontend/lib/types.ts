export interface Studio {
  name: string;
  country: string;
  foundedYear: number;
  website: string;
  sizeCategory: "indie" | "mid-size" | "aaa";
  hqCity: string;
}

export interface Game {
  _id: string;
  id?: string;
  title: string;
  description: string;
  genre: string[];
  releaseYear: number;
  platform: string;
  ageRating: string;
  priceCHF: number;
  tags: string[];
  multiplayer: boolean;
  earlyAccess: boolean;
  supportedLanguages: string[];
  averagePlaytimeHours: number;
  studio: Studio;
  coverImage?: string;
}

export interface Review {
  _id: string;
  gameId: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  text: string;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LibraryEntry {
  _id?: string;
  gameId: string;
  addedAt: string;
  hoursPlayed: number;
  lastPlayedAt: string;
  achievements: string[];
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  country: string;
  birthYear: number;
  joinedAt: string;
  level: number;
  status: "online" | "offline" | "away" | "in-game";
  preferredLanguage: string;
  discordTag?: string;
  bio: string;
  avatarUrl?: string;
  library: LibraryEntry[];
}
