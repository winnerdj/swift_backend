/backend
│── /src
│   │── /config                   # Configuration files (e.g., env variables, DB config)
│   │── /services                 # 
│       │── /service              # Business logic (interacts with data layer)
│       │── /data-layer           # Handles DB queries (repository pattern)
│   │── /models                   # Database models and schemas
│   │── /middlewares              # Express middleware functions (auth, logging, etc.)
|   |── /api                      # 
│       |── /controllers          # Handles HTTP requests and responses
│       |── /routes               # API route definitions
│       |── /schema               # Middleware for schema check for HTTP requests
│   │── /helpers                  # Utility functions, reusable logic
│   │── /types                    # TypeScript types/interfaces
│   │── /tests                    # Unit & integration tests
│   │── server.ts                 # Express app initialization
│── package.json
│── .env                          # Environment variables
│── .gitignore
│── README.md


Best Practice for naming
🔹 Use kebab-case for directories (/user-services).
🔹 Use camelCase for filenames (userController.js).
🔹 Use PascalCase for classes (UserService.js).