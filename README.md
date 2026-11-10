# Loop — Mini Social Media Platform

A simple college-project demo with user profiles, posts, comments, likes and following.

## Technologies
- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js + Express
- Data storage: JSON files (no MongoDB or separate database server)

## Run the project
1. Install Node.js if it is not already installed.
2. Open this folder in VS Code.
3. Open Terminal in VS Code and run: `npm install`
4. Run: `npm start`
5. Open `http://localhost:3000` in your browser.

## Demo features
- Three sample profiles and sample posts are included.
- Create a new profile.
- Publish a text post.
- Like and unlike posts.
- Comment on posts.
- Follow and unfollow other profiles.
- Data is saved in `data/users.json` and `data/posts.json`.

This is a learning/demo project only. It has no real password-based authentication, image uploads, privacy controls, or production database. Do not use it to store sensitive personal information.

## Reset demo data
Restore the original sample content by replacing `data/users.json` and `data/posts.json` with their initial contents from the project ZIP, or extract a fresh copy.
