# 💰 Finance Dashboard UI

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, aesthetically pleasing, and feature-rich finance management dashboard. Built with a focus on modern UI/UX principles, glassmorphism, and responsive design. This dashboard provides a comprehensive view of your financial health with real-time data visualization and interactive transaction management.

![Custom Finance Dashboard Preview](file:///C:/Users/SONU/.gemini/antigravity/brain/440ae0de-34a2-422c-aa96-cc81f42b44d5/finance_dashboard_preview_1775396449897.png)

---

## ✨ Key Features

### 📊 Advanced Data Visualization
- **Dynamic Balance Trend**: Real-time interactive area charts to track your wealth over time.
- **Spending Breakdown**: Categorized donut charts that automatically highlight where your money goes.
- **Stat Cards**: Quick-glance summaries of Total Balance, Monthly Income, and Active Expenses with glowing indicator effects.

### 💸 Transaction Management (Full CRUD)
- **Seamless Operations**: Add, Edit, and Delete transactions via a sleek, modal-driven interface.
- **Smart Filtering**: Filter by category (e.g., Food, Transport, Rent) or type (Income/Expense).
- **Global Search**: Instantly find any transaction with a high-speed fuzzy search.
- **Sorting Logic**: Organize your financial history by date or amount with a single click.

### 🛡️ Role-Based Access Control (RBAC)
- **Admin Mode**: Full administrative privileges to modify data.
- **Viewer Mode**: A read-only experience perfect for auditing or shared viewing.
- **Toggle System**: Easy switching between roles for testing and demonstration.

### 🧠 Intelligent Insights
- **AI-Driven Observations**: Automatically calculates savings rates and identifies unusual spending patterns.
- **Financial Tips**: Dynamic suggestions based on your income-to-expense ratio.

### 🎨 Premium UI/UX Design
- **Glassmorphism**: Modern frosted-glass aesthetics for a premium "Apple-style" look.
- **Smooth Animations**: Powered by `Framer Motion` for fluid transitions and interactive hover effects.
- **Dark/Light Mode**: Full theme customization that persists across sessions.
- **Mobile First**: Completely responsive layout that looks stunning on phones, tablets, and desktops.

---

## 🚀 Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core frontend library for building modern interfaces. |
| **Vite** | Lightning-fast build tool and development server. |
| **Tailwind CSS** | Utility-first CSS framework for rapid, custom styling. |
| **Recharts** | Composability-focused charting library for React. |
| **Framer Motion** | Industry-standard animation engine for smooth UI interactions. |
| **Lucide React** | Beautiful, consistent, and customizable SVG icons. |
| **jsPDF** | Client-side PDF generation for exporting reports. |
| **localStorage** | Persistent data storage without the need for a backend. |

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/finance-dashboard-ui.git
   cd finance-dashboard-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── Dashboard/      # Visualization & Stat components
│   ├── Transactions/   # List, Modals, & Filtering
│   ├── Sidebar.jsx     # Main navigation & toggles
│   └── ui/             # Reusable UI primitives (Buttons, Cards)
├── context/            # Global state (FinanceContext)
├── utils/              # Helper functions & Mock data logic
├── App.jsx             # Main application entry
└── index.css           # Global styles & Tailwind config
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ✉️ Contact

**Project Link:** [https://github.com/yourusername/finance-dashboard-ui](https://github.com/yourusername/finance-dashboard-ui)

Created with ❤️ by Sonu Kumar
