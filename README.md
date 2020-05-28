# QuarantineTalk
A simple twitter clone full stack project using Firebase and Express for the backend and React, React Redux, and Materials UI for the front end.

## Functionality
- 4 pages: signup, login, home, users

### Signup 
- signup will allow users to make an account using a valid email, password, confirmed password, and a unique handle
- onced signed up each user will receive an authentication token that will then allow them to interract with "chats" (more on that later)

### Login
- this page will allow the user to login using an existing email and it's corresponding password
- logging in will also give the same user an authetication token. these tokens will only be valid for 60min and then they will expire and log the user out

### Home
- home page is where the magic happens
- if not logged in, the unlogged user will see "Login", "Home", "Signup" in the Navigation bar, else the logged user will be able to see "Add Chat", "Home", and "Notifications"
- to the left we will see the "chats" which is similar to twitter's "tweets".
- to the right we will see the profile of the logged in user. if the user is not logged in then will will see the option to login or sign up

#### Navigation
- for non-logged users: "Login", "Home", and "Signup" will simply bring you to those pages
- for logged users:
  - "Add Chat will allow the user to make a "chat" with only text input"
  - "Home" will take user to home screen
  - "Notifications" will allow the user to view any notifications they received from another user liking or commenting on their post.
    - click on notifications button will automatically mark those notifications as read
    - clicking on a notification will bring the user to the corresponding chat

#### Chats
- the chats will be similar to twitter
- user will only be able to post text chats
- user will be able to like and comment on any chat
- user will be able to delete their own chat
- user can extend a chat and like/comment from the displayed dialog

#### Profile
- the profile will be able to logout the user deleting authentication from local storage
- update/display bio
- update/display location
- update/display website
- display handle with link to user page
- display joined date

### Users
- users page will be similar to home page, but will only display chats of the individual user
