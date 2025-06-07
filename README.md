# Live Chat Webapp Documentation

Welcome to the **Live Chat Webapp**! This project is a real-time chat application built with [Next.js](https://nextjs.org), React, Zustand, React Query, and WebSockets (STOMP over SockJS). It features user authentication, contact management, group and private chats, notifications, and a modern UI styled with Tailwind CSS.

## Table of Contents

- Features
- Project Structure
- Getting Started
- Core Concepts
- Testing
- Customization
- Learn More

---

## Features

- **User Authentication:** Register and log in securely.
- **Contacts:** Add, remove, and manage contacts.
- **Chats:** Start private or group chats, send and receive messages in real time.
- **Notifications:** Receive instant notifications for new messages and contact invites.
- **Responsive UI:** Clean, accessible, and responsive interface using Tailwind CSS.
- **State Management:** Uses Zustand for global state and React Query for server state.
- **WebSocket Integration:** Real-time updates via STOMP protocol.

---

## Project Structure

```
/src
  /app           # Next.js app directory (pages, layouts, providers)
  /components    # Reusable UI components and icons
  /hooks         # Custom React hooks (API, sockets, chat logic)
  /stores        # Zustand stores for global state
  /lib           # Utility functions
  /@types        # TypeScript types and interfaces
/public          # Static assets
```

Key files and folders:

- `src/app/page.tsx`: Home page (contacts list)
- `src/app/chats/page.tsx`: User chats overview
- `src/app/chats/[chatId]/page.tsx`: Individual chat view
- `src/app/notifications/page.tsx`: Notifications and contact invites
- `src/hooks/useLiveChat.ts`: API request abstraction
- `src/hooks/useNotificationSocket.ts`: WebSocket logic
- `src/stores/userStore.ts`: User state management

---

## Getting Started

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Run the development server:**

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Run tests:**

   ```sh
   npm test
   ```

---

## Core Concepts

### Authentication

- Registration and login handled via API endpoints.
- Auth token is stored in a cookie.
- Middleware protects routes from unauthenticated access.

### Contacts & Chats

- Contacts can be added/removed via the notifications page.
- Chats can be started with contacts (private) or with multiple users (group).
- Chat data is fetched and managed using React Query.

### Real-Time Messaging

- WebSocket connection is managed by `useNotificationSocket`.
- Notifications and chat messages are received and handled in real time.

### State Management

- Zustand store keeps track of user data and notifications.
- React Query handles server state and caching.

### UI

- Components are in `src/components/ui`.
- Tailwind CSS for styling.

---

## Testing

- Unit and integration tests are written with Jest and React Testing Library.
- Run all tests with `npm test`.
- Coverage reports can be generated with `npm run test:coverage`.

---

## Customization

- **Styling:** Edit `tailwind.config.ts` and `src/app/globals.css`.
- **API Endpoints:** Update API URLs in `src/hooks/useLiveChat.ts`.
- **State:** Add new Zustand stores in `src/stores`.
- **Components:** Add or modify UI components in `src/components/ui`.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
