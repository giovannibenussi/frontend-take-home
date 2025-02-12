<div align="center">
    <img src="https://github.com/giovannibenussi/frontend-take-home/blob/main/workos-logo.png?raw=true" alt="Logo" width="200">


  <h3 align="center" style="margin-top: 0.5em;">Frontend Take-Home Assignment</h3>

  <p align="center">
WorkOS's Frontend Take-Home Assignment implementation by Giovanni Benussi.
    <br />
  </p>
</div>

## Welcome
Hi! 👋 I'm Giovanni Benussi and this is my implementation of the [Frontend Take-Home Assignment](https://github.com/workos/frontend-take-home?tab=readme-ov-file) by WorkOS. 

This project implements a user interface for a user and role management system and consists of a backend API and a frontend client that consumes it.

<img src="https://github.com/giovannibenussi/frontend-take-home/blob/main/ui-demo.png?raw=true" alt="Logo" width="100%">

## Getting Started
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
## Potential Improvements
There's always room for improvement! Even though the current implementation of the assignment works as expected, there are some areas that could be improved. Below is a list of improvements and ideas for future work:

- Mobile design for the user and role tables.
- Persist pagination and search state in the URL.
- Use optimistic UI when creating, updating and deleting users and roles.
- Allow to upload a profile picture when creating a new user.
- Fine-tune the debounce delay for the user search input. The current value is 500ms [as recommended on some UX websites](https://ux.stackexchange.com/a/110444) but it needs further research and testing.
- Test UI with long names and descriptions to make sure that it adapts well to different kinds of content.
