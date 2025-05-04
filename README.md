# 🎨 Doodle

> **The backend server for an online multiplayer drawing and guessing game (Pictionary) built with modern web technologies.**

The Doodle server powers the real-time, multiplayer gameplay of the Doodle app. It handles communication between players using **Socket.IO**, ensures synchronization of the game state, and implements core game logic.

---

## 🚀 Features

- ⚡ **Real-time Communication:** Leverages **Socket.IO** for real-time, low-latency interactions between clients.
- 🔄 **Game State Management:** Handles game room setups, player turns, drawing events, and scores.
- ✅ **Scalable Architecture:** Built with **Node.js** and **TypeScript** for clean, efficient, and maintainable code.
- 🔒 **Environment Configuration:** Securely configures sensitive data with `.env` files.
- ⚙️ **Customizable Events:** Easily extendable Socket.IO event handlers for custom logic.

---

## 🛠️ Tech Stack

A modern backend stack powers the server:

- **Node.js:** Runtime environment for the server.
- **TypeScript:** Strongly typed programming for reliability and maintainability.
- **Socket.IO:** Enables bidirectional communication between the client and server.
- **dotenv:** Manages configuration via environment variables.

---

## 🏗️ Project Structure

Here’s an overview of the folder structure within the server:

```plaintext
/src
│
├── constants/      # Socket.IO events, default configuration values, etc
│
├── controllers/    # Contains logic for socket event handling and delegating actions to responsible services 
│
├── models/         # Models for game, rooms, doodlers, etc.
│
├── services/       # Room, Doodler, Game and Socket services that manage their own responsbilities
│
├── utils/          # Utility functions and helpers
│
├── types/          # Typescript type definitions
│
└── app.ts          # Entry point for the server
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js (>= 16.x):** [Download here](https://nodejs.org/)
- **npm** (Comes with Node.js)

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Experimentf/doodle-server.git
   cd doodle-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project to configure the server environment:

   ```env
   PORT=5000
   DOODLE_CLIENT_URL=http://localhost:3000
   ```

   Replace `http://localhost:3000` with the actual client URL if needed.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The server will be up and running at `http://localhost:5000`.

---

## 📡 Socket.IO Features

The server facilitates real-time communication between multiple clients through **Socket.IO**.

### Key Events & Handlers
- All the socket events being handled are specified [here](https://github.com/Experimentf/doodle-server/blob/main/src/constants/events/socket.ts)

The Socket.IO event system is modular and supports creating custom events to extend functionality.

---

## 🛡️ Environment Variables

| Variable      | Description                       | Default Value           |
|---------------|-----------------------------------|-------------------------|
| `PORT`        | Port the server runs on           | `5000`                  |
| `DOODLE_CLIENT_URL` | The URL of the client application | `http://localhost:3000` |

Add these variables to a `.env` file in the root directory for local development.

---

## 📦 Deployment

### Build for Production
To build the server for production:

```bash
npm run build
```

The compiled files will be output to the `dist/` directory.

### Run the Production Server
After building the project, start the server using:

```bash
npm run dev
```

---

## 🙌 Contributing

Contributions are welcome! If you’d like to improve the project, follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes (`git commit -m 'Add awesome feature'`).
4. Push to the branch (`git push origin feature/awesome-feature`).
5. Open a pull request!

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](https://github.com/Experimentf/doodle-server/blob/main/LICENSE) file for details.

---

## 👨‍💻 Maintainers

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/divyanshf">
        <img src="https://github.com/divyanshf.png" width="100px;" alt="divyanshf"/><br />
        <sub><b>@divyanshf</b></sub>
      </a>
    </td>
  </tr>
</table>

---

Enjoy building and contributing to **Doodle Server**! 🎉
