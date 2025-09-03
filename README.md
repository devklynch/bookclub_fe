# Booked & Busy - Frontend 📚☕

A modern React-based frontend for managing book clubs, events, and reading discussions. This application provides an intuitive interface for book lovers to organize their reading communities.

## 🌟 Features

### Core Functionality

- **User Authentication**: Secure login/logout, account creation, password reset
- **Book Club Management**: Create, join, and manage multiple book clubs
- **Event Scheduling**: Plan and track book club meetings and discussions
- **Polling System**: Vote on book selections and club decisions like events
- **Dashboard**: Centralized view of all your book clubs, upcoming events, and active polls

### User Experience

- **Responsive Design**: Beautiful, mobile-friendly interface with Bootstrap styling
- **Real-time Updates**: Dynamic content loading and user interactions
- **Intuitive Navigation**: Clean routing with React Router for seamless page transitions

## 🏗️ Tech Stack

- **Frontend Framework**: React
- **UI Framework**: React Bootstrap
- **HTTP Client**: Axios
- **Testing**: Cypress

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd bookclub/bookclub_fe
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Copy the appropriate environment file:

   ```bash
   # For development
   cp env.development .env

   # For production
   cp env.production .env
   ```

   The environment variables include:

   - `VITE_API_BASE_URL`: Backend API endpoint (default: http://localhost:3000/api/v1)
   - `VITE_FRONTEND_URL`: Frontend URL (default: http://localhost:5173)

### Running Locally

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

The application will automatically reload when you make changes to the source code.

### Backend Dependency

This frontend requires the Rails backend API to be running. Make sure to:

1. Start the backend server (typically on port 3000)
2. Ensure the `VITE_API_BASE_URL` in your `.env` file points to the correct backend URL

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookClubCard.jsx
│   ├── EventCard.jsx
│   ├── PollCard.jsx
│   └── ...modals
├── utils/              # Utility functions
│   └── dateUtils.js
├── assets/             # Static assets
├── App.jsx             # Main application component
├── api.jsx             # API communication layer
├── Dashboard.jsx       # Main dashboard view
├── Login.jsx           # Authentication views
├── BookClubDetail.jsx  # Detail views
└── ...
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run cypress:open` - Open Cypress testing interface
- `npm run cypress:run` - Run Cypress tests headlessly

## 🧪 Testing

This project uses Cypress for end-to-end testing:

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run tests in headless mode
npm run cypress:run
```

Test files are located in the `cypress/e2e/` directory.

## 🔐 Authentication Flow

1. **Login/Register**: Users can create accounts or sign in
2. **Token Management**: JWT tokens stored in localStorage
3. **Protected Routes**: Automatic redirection for unauthorized access
4. **Password Recovery**: Forgot/reset password functionality

## 📱 Key Pages

- **Dashboard**: Overview of all user's book clubs, events, and polls
- **All Book Clubs**: Browse and join available book clubs
- **All Events**: View upcoming and past events
- **All Polls**: Participate in active voting
- **Book Club Detail**: Manage individual club settings and members
- **Event Detail**: View event information and manage attendance
- **Poll Detail**: Vote on book selections and view results
- **User Settings**: Update profile and preferences

## 🚀 Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory and can be served by any static file server.

## 🤝 Contributing

1. Follow the existing code style and structure
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test your changes before submitting
5. Ensure responsive design works on mobile devices

## 📧 Support

For issues or questions about the frontend application, please check the existing documentation or reach out to the development team.

---

_Happy reading! 📖✨_
