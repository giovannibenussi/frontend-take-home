# Getting Started
# Start the Backend API

1. **Start the Backend API**:
   - Ensure you have the latest version of Node.js.
   - Run the following commands to install dependencies and start the API:
     ```bash
     cd server
     npm install
     npm run api
     ```

1. **Start the Frontend Client**:
   - Ensure you have the latest version of Node.js.
   - Run the following commands to install dependencies and start the client:
     ```bash
     cd client
     npm install
     npm run dev
     ```
# Potential Improvements

- Mobile design for the user and role tables.
- Persist pagination and search state either in local storage or in the URL.
- Allow to upload a profile picture when creating a new user.
- Fine-tune the debounce delay for the user search input. The current value is 500ms as recommended on some UX websites but it needs further research and testing.
- Test UI with really long names and descriptions.
