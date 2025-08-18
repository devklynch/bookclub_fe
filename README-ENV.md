# Environment Configuration

This project uses environment variables to handle different deployment environments.

## Environment Files

### Development (env.development)

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_FRONTEND_URL=http://localhost:5173
```

### Production (env.production)

```bash
VITE_API_BASE_URL=https://yourdomain.com/api/v1
VITE_FRONTEND_URL=https://yourdomain.com
```

## Usage

The environment variables are automatically loaded based on your build command:

- **Development**: `npm run dev` (uses env.development)
- **Production**: `npm run build` (uses env.production)

## Environment Variables

- `VITE_API_BASE_URL`: The base URL for your Rails API backend
- `VITE_FRONTEND_URL`: The base URL for your React frontend

## Important Notes

- All environment variables must start with `VITE_` to be accessible in the frontend
- The `.env.local` file (if it exists) will override other environment files
- Environment files are loaded at build time, not runtime
- For production deployment, set these as environment variables in your hosting platform

## Example Deployment

For production deployment, you would set these environment variables:

```bash
export VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
export VITE_FRONTEND_URL=https://yourdomain.com
```

Then run `npm run build` to create a production build with the correct URLs.
