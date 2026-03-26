# Gaming Platform API Documentation

## Base URL
`/api`

## Response Format
All successful responses follow this format:
```json
{
  "success": true,
  "data": { ... } // Or an array of objects
}
```
If returning a list, an optional `count` property may be included.

All error responses follow this format, returning the appropriate HTTP status code (400, 401, 403, 404, 500, etc):
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Endpoints

### Auth (`/api/auth`)
- **`POST /register`**: Register a new user.
  - Body: `username`, `email`, `password`.
  - Returns: `{ "success": true, "data": { "_id", "username", "email" } }`
- **`POST /login`**: Authenticate a user.
  - Body: `email`, `password`.
  - Returns: `{ "success": true, "data": { "token" } }`

### Users (`/api/users`) - Requires Auth
- **`GET /me`**: Get current user profile.
- **`GET /me/library`**: Get all games in user's library.
- **`POST /me/library/:gameId`**: Add a game to the library.
- **`DELETE /me/library/:gameId`**: Remove a game from the library.

### Games (`/api/games`)
- **`GET /`**: Get all games.
- **`GET /:id`**: Get a single game.
- **`POST /`**: Create a game (Requires `title`, `studio`).
- **`PUT /:id`**: Update a game.
- **`DELETE /:id`**: Delete a game.

### Reviews (`/api/reviews`)
- **`GET /game/:gameId`**: Get all reviews for a specific game.
- **`POST /`**: Create a review (Requires Auth, `game` id, `rating`, `comment`).
- **`PUT /:id`**: Update a review (Requires Auth, user must own the review).
- **`DELETE /:id`**: Delete a review (Requires Auth, user must own the review).
