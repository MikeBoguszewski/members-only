# **Members Only App**

This is a solution to the **Members Only** project from [The Odin Project](https://www.theodinproject.com/), which focuses on building a full-stack app that allows users to log in and create posts, but only authorized members can see the time and author of the post and create posts. The app involves using **Node.js**, **Express**, and **MongoDB** for backend management, and **EJS** for templating.

## **Overview**

### **The Challenge**
- Users should be able to:
  - Sign up and log in to the app using an authentication system.
  - Create posts only when signed in.
  - Users can see the post's author and date of posts made by other users only when they are signed in and are a member.
  - Implement user authorization using session management.

## **Screenshot**

![App Screenshot](./screenshot.jpg)

## **Links**
- Live Demo: https://members-only-iw3z.onrender.com/ (due to limited resources, the server may take up to a minute to start up)
- GitHub Repository: https://github.com/MikeBoguszewski/members-only

---

## **Unlock Member and Admin Access:**
### Member Access Password: Secret_1234
- Allows you to make mosts and view additional post details, like the author's name and the timestamp.

### Admin Access Password: admin_1234
- Admins can delete posts to manage content that other members create.

# **My Process**

## **Built With**
- **Node.js** - JavaScript runtime for building the server.
- **Express** - Web framework for handling HTTP requests.
- **MongoDB** - NoSQL database used for storing user data and posts.
- **EJS** - Templating engine for rendering dynamic HTML views.
- **Passport.js** - Authentication middleware for Node.js, used to manage login and session state.
- **Bcrypt.js** - Password hashing library for securely storing user passwords.

## **What I Learned**
This project taught me how to build a backend application with authentication and authorization. Key concepts learned include:

- Setting up **user authentication** using Passport.js and **bcrypt.js** for secure password hashing.
- Santizing user inputs using **express-validator**.
- Working with **MongoDB** to store user data and posts.
- Implementing a basic **CRUD (Create, Read, Update, Delete)** functionality for the posts.
- Using **EJS** to build dynamic, user-specific HTML pages.

**Example code snippet (authentication middleware):**
  ```js
passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});
```

## Possible Improvements
- Implement admin and member status checks on the backend for increased security.





