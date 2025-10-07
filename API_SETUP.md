# API Configuration

This project now uses axios for API calls. Here's how to configure it:

## Environment Variables

Create a `.env` file in the root directory with:

```env
# API Configuration
REACT_APP_API_URL=https://your-api-domain.com/api

# For development with local API
# REACT_APP_API_URL=http://localhost:3001/api

# For testing with JSONPlaceholder (current default)
# REACT_APP_API_URL=https://jsonplaceholder.typicode.com
```

## API Endpoints

The application expects the following API endpoints:

### Signup
- **POST** `/users` - Create new user
- **Body**: `{ name, email, password, username }`
- **Response**: `{ id, name, email, token? }`

### Login
- **POST** `/auth/login` - Authenticate user
- **Body**: `{ email, password }`
- **Response**: `{ id, user?, token? }`

## Current Configuration

- **Base URL**: `https://jsonplaceholder.typicode.com` (test API)
- **Timeout**: 10 seconds
- **Headers**: `Content-Type: application/json`
- **Auth**: Bearer token automatically added to requests

## Features

- ✅ Axios interceptors for request/response handling
- ✅ Automatic token management
- ✅ Error handling for network issues
- ✅ Timeout configuration
- ✅ Request/response logging

## Testing

The current setup uses JSONPlaceholder as a test API. To test with a real backend:

1. Update `REACT_APP_API_URL` in your `.env` file
2. Ensure your API follows the expected response format
3. The app will automatically handle authentication tokens

## Error Handling

The app handles various error scenarios:
- Network errors
- Timeout errors
- HTTP status codes (400, 401, 409, etc.)
- API response messages
