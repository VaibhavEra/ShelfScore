## Project Overview

### Features:

1. **Landing Page**: Allows users to log in using Google.
2. **Dashboard**: Displays a grid of logged movies for returning users, or a search bar for first-time users.
3. **Movie Details Page**: Shows movie information, user ratings, notable points, and ShelfScore.
4. **Search Functionality**: Enables users to search and log movies using the TMDB API.

---

## Frontend Development (React.js)

### 1. **Project Structure**

- Create a React app with a component-based structure:
  - `/components`
    - `LandingPage.js`: The welcome page with a Google login button.
    - `Dashboard.js`: Displays the logged movies and the search bar.
    - `MovieCard.js`: Reusable component for displaying movie posters and titles.
    - `MovieDetails.js`: Shows movie details, user ratings, and the "log movie" form.
    - `SearchBar.js`: Handles movie search functionality.
    - `Modal.js`: A reusable popup for entering ratings and notable points.
  - `/pages`
    - `Home.js`: Combines components for the landing page.
    - `Library.js`: Renders the dashboard for logged-in users.
  - `/styles`: Separate CSS or styled-components for styling.

### 2. **Routing and Navigation**

- Use React Router to manage navigation between:
  - `/`: Landing page.
  - `/library`: Dashboard with user's movies.
  - `/movie/:id`: Movie details page.

### 3. **API Integration**

- Create a service to handle TMDB API requests (e.g., `tmdbService.js`).
- Add methods for:
  - Searching movies by title.
  - Fetching movie details by ID.

### 4. **State Management**

- Use React Context or a state management library like Redux for:
  - Storing user authentication state.
  - Managing the logged movies list.

---

## Backend Development (Express.js)

### 1. **Project Structure**

- Organize backend code as follows:
  - `/routes`
    - `authRoutes.js`: Handle Google OAuth login.
    - `movieRoutes.js`: Manage movie-related endpoints (CRUD operations).
  - `/controllers`
    - `authController.js`: Implements logic for user authentication.
    - `movieController.js`: Handles requests for adding, retrieving, and deleting movies.
  - `/models`
    - `User.js`: MongoDB schema for user data.
    - `Movie.js`: Subschema for movies within the User schema.
  - `/middlewares`
    - `authMiddleware.js`: Protects routes that require authentication.

### 2. **API Endpoints**

- **Authentication**:
  - POST `/login`: Authenticate user via Google OAuth and create a session.
  - GET `/logout`: End user session.
- **Movie Management**:
  - GET `/movies`: Retrieve logged movies for the authenticated user.
  - POST `/movies`: Add a movie to the user's library.
  - DELETE `/movies/:id`: Remove a movie from the user's library.
- **TMDB Proxy**:
  - GET `/search`: Fetch search results from the TMDB API.
  - GET `/movie/:id`: Fetch movie details from the TMDB API.

### 3. **Middleware**

- Add middleware for:
  - Authentication.
  - Error handling and response formatting.

---

## Database (MongoDB)

### 1. **Database Structure**

#### Users Collection:

```json
{
  "_id": "unique_user_id",
  "name": "User's Name",
  "email": "user@example.com",
  "movies": [
    {
      "movieId": "tmdb_movie_id",
      "title": "Movie Title",
      "posterUrl": "https://...",
      "synopsis": "Movie Synopsis",
      "ratings": {
        "visuals": 3,
        "story": 2,
        "direction": 3,
        "acting": 3,
        "sound": 2,
        "editing": 2
      },
      "notablePoints": "User notes about the movie.",
      "shelfScore": "Top Shelf"
    }
  ]
}
```

### 2. **Mongoose Models**

- **User Schema**:
  - Fields: `name`, `email`, `movies`.
  - Embedded `Movie` schema for storing logged movies.

---

## Development Workflow

### 1. **Frontend-Backend Integration**

- Use Axios or Fetch API to connect the frontend with backend endpoints.
- Handle authentication and protected routes using tokens or sessions.

### 2. **Testing**

- Test each component and endpoint separately:
  - Use tools like React Testing Library for frontend.
  - Use Postman or Thunder Client for backend API testing.
- Perform end-to-end testing to ensure smooth integration.

### 3. **Deployment**

- Deploy frontend on Vercel or Netlify.
- Deploy backend on Render, Heroku, or AWS.
- Use MongoDB Atlas for database hosting.

---

## Post-Launch Improvements

1. Add sorting and filtering options for the dashboard.
2. Implement sharing functionality to allow users to share reviews.
3. Integrate analytics to track user activity and popular movies.
