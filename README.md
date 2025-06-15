# Live Chat Webapp Documentation


Welcome to the **Live Chat Webapp**! This is a simple web interface built to serve as usage for the functionalities provided by [@thalesmaiaa/live-chat](https://github.com/thalesmaiaa/live-chat), built with [Next.js](https://nextjs.org), React, Zustand, React Query, and WebSockets (STOMP over SockJS). It features user authentication, contact management, group and private chats, notifications, and a modern UI styled with Tailwind CSS.

## Features

- **User Authentication:** Register and log in securely.
- **Contacts:** Add, remove, and manage contacts.
- **Chats:** Start private or group chats, send and receive messages in real time.
- **Notifications:** Receive instant notifications for new messages and contact invites.
- **Responsive UI:** Clean, accessible, and responsive interface using Tailwind CSS.
- **State Management:** Uses Zustand for global state and React Query for server state.
- **WebSocket Integration:** Real-time updates via STOMP protocol.

## Getting Started

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env` file in the root directory and add your API base URL and WebSocket URL:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/live-chat
   NEXT_PUBLIC_WS_URL=ws://localhost:8080/live-chat

   ```

   Adjust the URL according to your backend setup.

3. **Run the development server:**

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run tests:**

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
