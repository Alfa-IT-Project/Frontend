# ⚡ Alfa Hardware Store Management System – Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.0.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0.0-38B2AC)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

<p align="center"><b>Modern, Responsive, All-in-One Dashboard for Hardware Store Operations</b></p>

</div>

---

## 🏪 About This Project

**Alfa Hardware Store Management System** is a next-generation web application designed to digitally transform hardware retail operations.  
It empowers store owners and staff with seamless inventory, CRM, supplier order, delivery, and staff management—all from a single, beautiful dashboard.

**Key benefits:**
- 🗃️ Centralized workflow for inventory, suppliers, customers, and staff
- 📊 Real-time analytics, updates, and management insights
- 🔒 Secure & role-based access for every user type
- 📱 Responsive design—works perfectly on any device

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [💼 Business Features](#-business-features)
- [🔒 Access Control & Permissions](#-access-control--permissions)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [💻 Development](#-development)
- [🧪 Testing](#-testing)
- [🏗️ Building](#-building)
- [🔧 Configuration](#-configuration)
- [📦 Dependencies](#-dependencies)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Authors](#-authors)
- [🙏 Acknowledgments](#-acknowledgments)

---

## ✨ Features

### Core Features
- ⚛️ Modern React 19 with advanced optimizations
- 📱 Fully responsive UI powered by Tailwind CSS
- 🎨 Rich component libraries: Material-UI & Ant Design
- 📅 Advanced scheduling with FullCalendar
- 📊 Interactive charts & analytics
- 📝 Smooth forms with React Hook Form
- 🔄 Real-time data fetching via React Query
- 📄 Export to PDF & Excel
- 🔔 Toast notification system
- 💙 TypeScript-first for robust development

### UI/UX Features
- 💎 Clean, modern interface with dark/light mode
- ⚡ Fast loading & animated transitions
- 🔍 SEO & accessibility optimized

---

## 💼 Business Features

### User Management
- 👤 User registration, authentication, and multi-factor auth
- 🛡️ Role-based access (RBAC) & granular permissions
- 🔑 Password reset, session, and activity management

### CRM
- 👥 Customer profiles, lead tracking, and segmentation
- 📈 Sales pipeline, analytics, and reporting
- 📧 Email integration & communication history

### Inventory
- 📦 Stock tracking, low-stock alerts, and forecasting
- 🏷️ Product categorization, batch tracking, and analytics

### Supplier Orders
- 📋 Purchase order management
- 📊 Supplier metrics, cost analysis, and order status

### Delivery
- 🚚 Real-time delivery tracking and route optimization
- 📊 Delivery analytics, scheduling, and customer preferences

### Staff
- 👥 Employee profiles, attendance, payroll & scheduling
- 🎯 Performance and training management

---

## 🔒 Access Control & Permissions

- **Route Protection**
  - 🔒 Authentication Guard: Ensures only logged-in users access protected routes
  - 🛡️ Role Guard: Restricts access by user role
  - 📋 Permission Guard: Manages feature-level permissions

- **Implementation**
  - 🔐 JWT-based authentication
  - 🎯 Permission-based rendering & dynamic menus
  - 🔍 Audit logging for access attempts

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS, Styled Components, Material-UI, Ant Design
- **Data:** React Query, Axios, Chart.js, FullCalendar
- **Forms & Notifications:** React Hook Form, React Hot Toast, React Toastify
- **Utilities:** date-fns, xlsx, jsPDF, @react-pdf/renderer

---

## 📁 Project Structure

```
src/
├── components/       # UI elements
│   ├── common/       # Shared components
│   ├── layout/       # Layouts
│   └── forms/        # Form components
├── pages/            # Page-level components
│   ├── auth/         
│   ├── dashboard/    
│   └── settings/     
├── services/         # API & auth services
├── utils/            # Helpers & constants
├── hooks/            # Custom React hooks
├── types/            # TypeScript types
├── styles/           # Global styles
└── App.js            # Main app entry
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+) or yarn (v1.22+)
- Git

### Installation

1. **Clone the repo:**
    ```bash
    git clone https://github.com/Alfa-IT-Project/Frontend.git
    ```
2. **Go to project directory:**
    ```bash
    cd app
    ```
3. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
4. **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```
5. **Start the app:**
    ```bash
    npm start
    # or
    yarn start
    ```
   App is now running at [http://localhost:3000](http://localhost:3000)

---

## 💻 Development

**Scripts:**
- `npm start` – Dev mode
- `npm test` – Run tests
- `npm run build` – Production build
- `npm run eject` – Eject config (irreversible)
- `npm run lint` – Lint code
- `npm run format` – Format with Prettier

**Code Style:**
- ESLint, Prettier, TypeScript

**Git Workflow:**
1. Create a feature branch
2. Commit with clear messages
3. Write/update tests and docs
4. Open a pull request

---

## 🧪 Testing

- **Jest** & **React Testing Library**
- Run all tests:
    ```bash
    npm test
    ```
- Watch mode:
    ```bash
    npm test -- --watch
    ```
- Coverage:
    ```bash
    npm test -- --coverage
    ```

---

## 🏗️ Building

**Production Build:**
```bash
npm run build
```
Artifacts in `build/`

**Env Vars:**
- `REACT_APP_API_URL` – API endpoint
- `REACT_APP_ENV` – development/production

---

## 🔧 Configuration

- **Tailwind:** `tailwind.config.js`, `postcss.config.js`
- **TypeScript:** `tsconfig.json`
- **ESLint:** `.eslintrc.js`

---

## 📦 Dependencies

### Core
- React 19
- TypeScript
- Tailwind CSS
- Material-UI
- Ant Design

### Development
- ESLint
- Prettier
- Jest
- React Testing Library

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 🚀

**Pull Request Process:**
- Update docs/README if needed
- Await at least one developer sign-off

---

## 📄 License

MIT License – see [LICENSE](LICENSE).

---

## 👥 Authors

| Name | Role | GitHub |
|------|------|--------|
| **KUMARI M. A. D. N.** | Login & CRM, Project Lead | [nadee2k](https://github.com/nadee2k) |
| **KAPUWELLA K. G. N. D.** | Inventory | [NipunDemintha](https://github.com/NipunDemintha) |
| **VITHANA Y. S. D.** | Staff | [diw-666](https://github.com/diw-666) |
| **AYYASH M. R. Y.** | Delivery | [yahiyaiyash](https://github.com/yahiyaiyash) |
| **BISHRU R. M.** | Supplier Orders | [Bishru182](https://github.com/Bishru182) |

---

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material-UI](https://mui.com/)
- [Ant Design](https://ant.design/)
- All open-source tools & libraries that power this project

---

<p align="center"><b>🚀 Run your hardware store smarter, faster, and more beautifully!</b></p>
