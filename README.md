# Frontend Project

<div align="center">

![React](https://img.shields.io/badge/React-19.0.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0.0-38B2AC)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, feature-rich React application built with the latest web technologies and best practices.

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Business Features](#-business-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Testing](#-testing)
- [Building](#-building)
- [Configuration](#-configuration)
- [Dependencies](#-dependencies)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

### Core Features
- 🚀 Modern React 19 with latest features and optimizations
- 📱 Fully responsive design using Tailwind CSS
- 🎨 Rich UI components with Material-UI and Ant Design
- 📅 Advanced calendar functionality with FullCalendar
- 📊 Interactive charts and data visualization
- 📝 Form handling with React Hook Form
- 🔄 Real-time data fetching with React Query
- 📄 PDF generation and export capabilities
- 📈 Excel file import/export functionality
- 🔔 Toast notifications system
- 🎯 TypeScript support for better development experience

### UI/UX Features
- 🎨 Modern and clean user interface
- 🌙 Dark/Light mode support
- 📱 Mobile-first responsive design
- ⚡ Fast loading and smooth transitions
- 🔍 SEO optimized
- ♿ Accessibility support

## 💼 Business Features

### User Management System
- 👤 User registration and authentication
- 🔐 Role-based access control (RBAC)
- 👥 User profile management
- 🔑 Password reset and recovery
- 📱 Multi-factor authentication
- 📊 User activity tracking
- 🔒 Session management
- 👮‍♂️ Permission management

### Customer Relationship Management (CRM)
- 👥 Customer profile management
- 📞 Contact management
- 📝 Lead tracking and management
- 📊 Customer interaction history
- 📈 Sales pipeline visualization
- 📧 Email integration
- 📱 Communication history
- 🎯 Customer segmentation
- 📊 Analytics and reporting

### Inventory Management
- 📦 Stock tracking and management
- 🔄 Real-time inventory updates
- 📊 Stock level monitoring
- 📈 Inventory analytics
- 🏷️ Product categorization
- 📝 Batch tracking
- 🔍 Product search and filtering
- 📊 Low stock alerts
- 📈 Inventory forecasting

### Supplier Order Management
- 📋 Purchase order creation
- 📊 Order tracking
- 📈 Supplier performance metrics
- 📝 Order history
- 🔄 Order status updates
- 📧 Supplier communication
- 📊 Cost analysis
- 📈 Order analytics
- 📱 Mobile order management

### Delivery Management
- 🚚 Delivery tracking
- 📍 Route optimization
- 📊 Delivery analytics
- 📱 Real-time status updates
- 📈 Performance metrics
- 📝 Delivery scheduling
- 🔍 Delivery search
- 📊 Delivery reports
- 🎯 Customer delivery preferences

### Staff Management
- 👥 Employee profiles
- 📊 Attendance tracking
- 📈 Performance monitoring
- 📝 Leave management
- 📊 Payroll integration
- 📱 Mobile attendance
- 📈 Staff analytics
- 🎯 Training management
- 📊 Work schedule management

## 🔒 Access Control & Permissions

### Role-Based Access Control (RBAC)

### Route Protection
- 🔒 **Authentication Guard**
  - Verifies user login status
  - Redirects to login if unauthenticated
  - Maintains session state

- 🛡️ **Role Guard**
  - Validates user role
  - Prevents unauthorized access
  - Redirects to dashboard if unauthorized

- 📋 **Permission Guard**
  - Checks specific permissions
  - Controls feature access
  - Manages granular permissions

### Implementation Details
- 🔐 JWT-based authentication
- 🔑 Role-based route guards
- 🎯 Permission-based component rendering
- 🔄 Dynamic menu generation
- 📱 Responsive access control
- 🔍 Audit logging of access attempts

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - Latest version with concurrent features
- **TypeScript** - For type safety and better development experience

### Styling Solutions
- **Tailwind CSS** - Utility-first CSS framework
- **Styled Components** - CSS-in-JS solution
- **Material-UI** - React UI framework
- **Ant Design** - Enterprise UI design system

### State Management & Data Fetching
- **React Query** - For server state management
- **Axios** - HTTP client for API requests

### UI Components & Libraries
- **FullCalendar** - Calendar and scheduling
- **Chart.js** - Data visualization
- **React Hook Form** - Form handling
- **React Router DOM** - Routing solution
- **React Hot Toast** - Toast notifications
- **React Toastify** - Additional notification system

### Utility Libraries
- **date-fns** - Date manipulation
- **xlsx** - Excel file handling
- **jsPDF** - PDF generation
- **@react-pdf/renderer** - React PDF generation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   └── forms/          # Form components
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   └── settings/      # Settings pages
├── services/           # API services
│   ├── api/           # API endpoints
│   └── auth/          # Authentication services
├── utils/              # Utility functions
│   ├── helpers/       # Helper functions
│   └── constants/     # Constants and configs
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── App.js              # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher) or yarn (v1.22.0 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Alfa-IT-Project/Frontend.git
```

2. Navigate to the project directory:
```bash
cd app
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

5. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## 💻 Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App
- `npm run lint` - Runs ESLint
- `npm run format` - Formats code with Prettier

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking

### Git Workflow

1. Create a new branch for your feature
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

## 🧪 Testing

The project uses Jest and React Testing Library for testing. Run tests using:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🏗️ Building

### Production Build

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Environment Variables

Required environment variables:
- `REACT_APP_API_URL` - API endpoint URL
- `REACT_APP_ENV` - Environment (development/production)

## 🔧 Configuration

### Tailwind CSS
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### TypeScript
- `tsconfig.json` - TypeScript configuration

### ESLint
- `.eslintrc.js` - ESLint configuration

## 📦 Dependencies

### Core Dependencies
- React 19
- TypeScript
- Tailwind CSS
- Material-UI
- Ant Design

### Development Dependencies
- ESLint
- Prettier
- Jest
- React Testing Library

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation
3. The PR will be merged once you have the sign-off of at least one other developer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

### Project Contributors

- **KUMARI M. A. D. N.** 
  - *Role:* Login Part and Customer Relationship Management
  - *GitHub:* [nadee2k](https://github.com/nadee2k)

- **KAPUWELLA K. G. N. D.**
  - *Role:* Inventory Management
  - *GitHub:* [NipunDemintha](https://github.com/NipunDemintha)

- **VITHANA Y. S. D.**
  - *Role:* Staff Management
  - *GitHub:* [diw-666](https://github.com/diw-666)

- **AYYASH M. R. Y.**
  - *Role:* Delivery Management
  - *GitHub:* [yahiyaiyash](https://github.com/yahiyaiyash)

- **BISHRU R. M.**
  - *Role:* Supplier Order Management
  - *GitHub:* [Bishru182](https://github.com/Bishru182)

### Project Lead
- **KUMARI M. A. D. N.**
  - *Role:* Project Lead
  - *GitHub:* [nadee2k](https://github.com/nadee2k)

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material-UI](https://mui.com/)
- [Ant Design](https://ant.design/)
- All other open-source libraries used in this project
