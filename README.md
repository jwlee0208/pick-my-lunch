
# Next Template

A modern, opinionated [Next.js](https://nextjs.org/) starter template with built-in support for TypeScript, Tailwind CSS, Redux Toolkit, Radix UI components, and more.

## 📦 Project Info

- **Version**: 0.0.2
- **Private**: Yes
- **Framework**: Next.js (v13+ App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Tailwind Variants
- **UI Components**: Radix UI, Lucide Icons, Framer Motion, Geist
- **State Management**: Redux Toolkit + React-Redux
- **Theme**: Dark mode support via `next-themes`

---

## 📁 Tech Stack

| Tech                     | Description                                |
|--------------------------|--------------------------------------------|
| **Next.js**              | React framework with server-side rendering |
| **React 18**             | Modern React with concurrent features      |
| **TypeScript**           | Static typing for safer development        |
| **Tailwind CSS**         | Utility-first CSS framework                |
| **Redux Toolkit**        | Simplified Redux setup                     |
| **Radix UI**             | Unstyled, accessible UI primitives         |
| **Lucide React**         | Icon library based on Feather Icons        |
| **Framer Motion**        | Animation library for React                |
| **Geist**                | Minimalist design system                   |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run the Dev Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 📦 Scripts

| Command              | Description                                 |
|----------------------|---------------------------------------------|
| `dev`               | Start development server                     |
| `build`             | Build the app for production                 |
| `start`             | Start the production server                  |
| `preview`           | Build and preview production locally         |
| `lint`              | Run ESLint                                   |
| `lint:fix`          | Lint and auto-fix issues                     |
| `typecheck`         | Run TypeScript type checker                  |
| `format:write`      | Format code using Prettier                   |
| `format:check`      | Check formatting with Prettier               |

---

## 🎨 Styling

- **Tailwind CSS** with custom variants via:
  - `class-variance-authority`
  - `tailwind-merge`
  - `tailwind-variants`
  - `tailwindcss-animate`
- **Dark mode** via `next-themes`

---

## 🛠 Dev Tools & Plugins

- **ESLint** with Prettier and Tailwind CSS plugin
- **Prettier** with import sorting (`@ianvs/prettier-plugin-sort-imports`)
- **TypeScript** with type checking script
- **Sharp** for image optimization

---

## ✅ Linting & Formatting

### Lint

```bash
npm run lint
```

### Auto-fix

```bash
npm run lint:fix
```

### Format Code

```bash
npm run format:write
```

---

## 📁 Folder Structure (예시)

```bash
.
├── app/                  # Next.js app router directory
├── components/           # Reusable UI components
├── lib/                  # Utility libraries and functions
├── store/                # Redux store and slices
├── styles/               # Tailwind and global styles
├── public/               # Static assets
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.ts    # Tailwind configuration
```

---

## 📄 License

This project is private and not intended for public use. If you wish to adapt or redistribute, please contact the project owner.

---

## 🙋‍♂️ Author

Built with ❤️ using Next.js + Tailwind + Radix UI.
