# Student Portfolio

This is a multi-route portfolio application built with React and Vite.

## Practical 3: API Integration and Data Rendering in React

In this practical, the Projects page has been updated to dynamically fetch and display repositories using the public GitHub REST API.

### API Used
- **GitHub API**: `https://api.github.com/users/<username>/repos`
- No authentication is required for basic public usage.

### Features Implemented
- **Dynamic Data Fetching**: Projects are loaded asynchronously on component mount using `useEffect`.
- **Loading State**: A spinner is shown while the network request is in progress.
- **Error State**: Handled separately to show an error message and a retry button if the API call fails.
- **Search & Filter**: Added an input field to filter the rendered list of repositories by name.
- **Premium UI**: Added CSS animations, grid layouts, gradients, and hover effects for a clean and responsive user experience.

### Setup Instructions
1. Ensure you have Node.js (v18+) installed.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Navigate to the Projects page to view the API integration in action.