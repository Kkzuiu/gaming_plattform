import { Game, Review, User, LibraryEntry } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = "API Error";
    try {
      const errData = await response.json();
      if (errData.error) message = errData.error;
    } catch {}
    throw new Error(message);
  }

  const data = await response.json();
  return data.data; // Server returns { success, count, data } or { success, data }
}

// ----- GAMES -----
export async function getGames(): Promise<Game[]> {
  return fetchApi<Game[]>("/games");
}

export async function getGameById(id: string): Promise<Game> {
  return fetchApi<Game>(`/games/${id}`);
}

export async function getGamesByIds(ids: string[]): Promise<Game[]> {
  try {
    const games = await Promise.all(ids.map(id => getGameById(id).catch(() => null)));
    return games.filter((g): g is Game => g !== null);
  } catch {
    return [];
  }
}

// ----- USERS -----
// Uses the token-based /users/me endpoint; id param is kept for API compatibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getUserById(_id: string): Promise<User> {
  return fetchApi<User>("/users/me");
}

export async function addToLibrary(gameId: string): Promise<LibraryEntry[]> {
  return fetchApi<LibraryEntry[]>(`/users/me/library/${gameId}`, { method: "POST" });
}

export async function removeFromLibrary(gameId: string): Promise<LibraryEntry[]> {
  return fetchApi<LibraryEntry[]>(`/users/me/library/${gameId}`, { method: "DELETE" });
}

export async function getReviewsByGameId(gameId: string): Promise<Review[]> {
  return fetchApi<Review[]>(`/reviews/game/${gameId}`);
}

export async function addReview(review: Omit<Review, "_id" | "createdAt" | "updatedAt">): Promise<Review> {
  return fetchApi<Review>("/reviews", {
    method: "POST",
    body: JSON.stringify(review),
  });
}

export async function updateReview(id: string, text: string, rating?: number): Promise<Review> {
  return fetchApi<Review>(`/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify({ text, rating }),
  });
}

export async function deleteReview(id: string): Promise<void> {
  await fetchApi(`/reviews/${id}`, { method: "DELETE" });
}

// ----- AUTH -----
export async function loginUser(email: string, password: string): Promise<{ token: string, user: User }> {
  return fetchApi<{ token: string, user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  country?: string;
  birthYear?: number;
  preferredLanguage?: string;
  discordTag?: string;
  bio?: string;
}): Promise<{ token: string, user: User }> {
  return fetchApi<{ token: string, user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}
