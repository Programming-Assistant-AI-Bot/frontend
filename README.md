# Programming Assistant AI Bot - Frontend

A modern React-based web interface for an AI-powered programming assistant that helps developers with code analysis, repository exploration, and programming queries.

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive chat with an AI programming assistant
- **Multi-Session Support**: Create and manage multiple chat sessions
- **Repository Integration**: Connect and analyze GitHub repositories
- **Web URL Analysis**: Analyze content from web URLs
- **File Upload Support**: Upload and analyze code files and PDFs
- **Real-time Streaming**: Live streaming responses from the AI
- **Code Syntax Highlighting**: Beautiful code block rendering with syntax highlighting
- **User Authentication**: Secure login and session management

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: React hooks with use-immer
- **HTTP Client**: Axios with authentication interceptors
- **Routing**: React Router DOM
- **Notifications**: Sonner toast notifications
- **Code Highlighting**: Custom CodeBlock components
- **Markdown Rendering**: ReactMarkdown

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd git_check/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chatBot/        # Original chatbot components
│   ├── login/          # Authentication components
│   ├── signup/         # User registration
│   └── ui/             # Shadcn UI components
├── ComponentsTharundi/  # Main application components
│   ├── ChatWindow.jsx  # Main chat interface
│   ├── SideBar.jsx     # Session management sidebar
│   ├── Homepage.jsx    # Main application layout
│   └── ...            # Other feature components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and API helpers
└── assets/             # Static assets
```

## 🔧 Configuration

### Environment Setup
The application connects to a backend API running on `http://localhost:8000`. Make sure your backend server is running before starting the frontend.

### Path Aliases
The project uses Vite path aliases configured in `vite.config.js`:
- `@/` maps to the `src/` directory

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

The application includes a complete authentication system:
- User registration and login
- JWT token management
- Protected routes
- Automatic token validation
- Session persistence

## 💬 Chat Features

### Session Management
- Create new chat sessions
- Browse previous conversations
- Search through chat history
- Delete unwanted sessions

### Content Attachment
- **File Upload**: Support for code files and PDFs
- **Repository Integration**: Analyze GitHub repositories
- **Web URL Analysis**: Extract and analyze web content

### AI Interaction
- Real-time streaming responses
- Code syntax highlighting
- Markdown formatting
- Error handling and retry mechanisms

## 🎨 UI Components

The project uses a combination of:
- **Shadcn UI**: For base components (buttons, inputs, dialogs)
- **Lucide React**: For icons
- **Tailwind CSS**: For styling and responsive design
- **Custom Components**: For specialized chat and AI features

## 🔌 API Integration

- RESTful API communication with the backend
- Authenticated requests using JWT tokens
- File upload with FormData
- Server-Sent Events (SSE) for streaming responses

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a Programming Assistant AI Bot system. Please refer to the main project license for usage terms.

## 🔗 Related

- Backend API: `../backend` (if applicable)
- Documentation: Link to full project documentation

---

Built with ❤️ using React and modern web technologies.