# Student Portfolio

This is a multi-route portfolio application built with React and Vite.

[![CI Pipeline](https://github.com/YugYadav25/student-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/YugYadav25/student-portfolio/actions/workflows/ci.yml)

## Practical 12: CI/CD Pipeline with GitHub Actions

The project includes a GitHub Actions CI pipeline that runs on pushes and pull
requests targeting `main`.

- The `lint` job installs frontend dependencies and runs `npm run lint`.
- The `build-and-test` job runs after linting, installs backend dependencies
  with `npm install`, and runs the Jest/Supertest test suite.
- A failed assertion or an incorrect test path produces a failed workflow
  status; correcting it produces a passing status.
- The workflow demonstrates Continuous Integration. Continuous Deployment
  would additionally publish the validated application to a deployment target.

To run the backend tests locally:

```bash
cd task-manager-api
npm install
npm test
```

## Practical 13: AI API Integration

The Task Manager includes an authenticated **Generate description** feature.
The React client sends only the task title to
`POST /api/ai/generate-description`; the backend calls OpenAI using
`OPENAI_API_KEY` from `task-manager-api/.env` and returns an editable
description suggestion.

Copy `.env.example` to `.env` in `task-manager-api` and add an API key locally.
Never put the key in frontend code or commit it to GitHub. If the provider is
unavailable, the backend returns a fallback message so task creation continues.
Requests for the same task title are limited to one per minute.

AI output is only a suggestion and must be reviewed before saving. Do not send
passwords, tokens, private personal data, or confidential information to an
external AI provider.

### Failed and Passed Run Demonstration

For the required lab evidence, temporarily change
`expect(response.statusCode).toBe(200)` in `server.test.js` to `201`, commit
and push it, then capture the red failed workflow run in the Actions tab.
Restore `200`, commit and push again, then capture the green passing run.
An incorrect test file path also fails the test job, but the log reports that
Jest could not find or run the specified test file rather than reporting an
assertion failure.

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