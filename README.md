# DAILY-SLICE

### **Project Checklist: Personalized Content Dashboard**

### **Phase 1: Project Setup & Foundation 🏗️**

- [x]  Initialize Next.js project with TypeScript & Tailwind
- [x]  Integrate `shadcn/ui`
- [x]  Install core dependencies (`@reduxjs/toolkit`, `react-redux`, `lucide-react`)
- [x]  Set up Redux store (`store.ts`, `uiSlice.ts`, `StoreProvider.tsx`)
- [x]  Apply Redux Provider in the root layout
- [x]  Configure environment variables (`.env.local`)

---

### **Phase 2: UI Layout & Static Components 🎨**

- [x]  Build the responsive `MainLayout.tsx` component
- [x]  Use `shadcn/ui Sheet` for the responsive mobile sidebar
- [x]  Use `next/link` for all internal navigation
- [x]  Add necessary `shadcn/ui` components (Card, Button, etc.)
- [x]  Create a flexible `ContentCard.tsx` component
- [x]  Implement the `ThemeToggle` component and connect it to Redux

---

### **Phase 3: State Management & API Integration ⚙️**

- [x]  Set up RTK Query (`apiSlice.ts`) and integrate it into the Redux store
- [x]  Create a `preferencesSlice.ts` for user categories
- [x]  Fetch data from the first API (e.g., News API) using an RTK Query hook
- [x]  Display loading states (e.g., spinners or skeletons)
- [x]  Display error states gracefully
- [x]  Render dynamic data using the `ContentCard` component

---

### **Phase 4: Implementing Core Features ✨**

- [x]  Build a settings panel to update user preferences in Redux
- [x]  Create a `favoritesSlice.ts` to manage favorited content
- [x]  Add "favorite" functionality to the `ContentCard`
- [x]  Create a `/favorites` page to display favorited items
- [ ]  Integrate a second API (e.g., TMDB for movies)
- [ ]  Integrate a mock social media feed
- [ ]  Combine all data sources into a single, unified feed

---

### **Phase 5: Advanced Features & Refinement 🚀**

- [ ]  Implement a debounced search bar
- [ ]  Implement infinite scrolling or pagination
- [- ] Add drag-and-drop reordering for content cards (`react-dnd` or `framer-motion`)
- [ ]  Add subtle UI animations and transitions

---

### **Phase 6: Testing 🧪**

- [ ]  Write unit tests for Redux slices and utility functions
- [ ]  Write integration tests for key components
- [ ]  Set up an E2E testing framework (Cypress or Playwright)
- [ ]  Write E2E tests for critical user flows (search, favorites, etc.)

---

### **Phase 7: Finalization & Submission ✅**

- [ ]  Perform final code cleanup and add documentation comments
- [ ]  Write a comprehensive `README.md` file
- [ ]  Deploy the application to a hosting service (e.g., Vercel)
- [ ]  Record a demo video of the application
- [ ]  Review all submission guidelines one last time

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



