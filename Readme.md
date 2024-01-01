# Video Streaming service Backend README

## Project Overview

This repository contains the source code for a web application. The application provides functionality related to user accounts, video management, likes, comments, playlists, posts, and various other features.

## Checklist

### Models

- [x] **user.model.js**
- [x] **video.model.js**
- [x] **like.model.js**
- [x] **comment.model.js**
- [x] **subscription.model.js**
- [ ] **playlist.model.js**
- [x] **post.model.js**

### Controllers

- [x] **user.controller.js**
- [x] **video.controller.js**
- [x] **like.controller.js**
- [x] **comment.controller.js**
- [ ] **subscription.controller.js**
- [ ] **playlist.controller.js**
- [ ] **post.controller.js**

### Middlewares

- [x] **auth.middleware.js**
- [x] **multer.middleware.js**
- [x] **validation.middleware.js**
- [x] **error.middleware.js**
- [x] **logging.middleware.js**

### Routes

#### Auth

- [x] **auth.route.js**
  - [x] Register
  - [x] Login
  - [x] Logout
  - [x] RefreshToken
  - [x] ChangePassword
  - [ ] DeleteAccount

#### User

- [ ] **user.route.js**
  - [x] GetCurrentUser
  - [x] GetChannelProfile
  - [x] GetWatchHistory
  - [ ] GetLikedVideoHistory
  - [x] UpdateAccountDetails
  - [x] UpdateUserAvatar
  - [x] UpdateUserCoverImage

#### Search

- [ ] **search.route.js**
  - [ ] GetVideosByContentDiscovery
  - [ ] GetVideosBySearch

#### Video

- [ ] **video.route.js**
  - [x] PostVideo
  - [ ] DeleteVideo
  - [x] EditVideoThumbnail
  - [x] EditVideoMetadata
  - [x] EditVideoVisibility
  - [x] GetVideoDetails
  - [x] GetVideosByUsers

#### Like

- [x] **like.route.js**
  - [x] UpdateLikeOnVideo
  - [x] UpdateLikeOnComment
  - [ ] UpdateLikeOnPost
  - [x] GetLikesOnVideo
  - [x] GetLikesOnComment
  - [ ] GetLikesOnPost

#### Comment

- [x] **comment.route.js**
  - [x] AddComment
  - [ ] RemoveComment
  - [x] UpdateComment
  - [x] GetAllComments

#### Playlist

- [ ] **playlist.route.js**
  - [ ] AddVideoInPlaylist
  - [ ] GetPlaylist
  - [ ] UpdatePlaylistMetaData
  - [ ] CreatePlaylist
  - [ ] RemoveVideoInPlaylist

#### Post

- [ ] **post.route.js**
  - [ ] CreatePost
  - [ ] UpdatePost
  - [ ] DeletePost
  - [ ] GetPost

### Services

- [x] **cloudinary.service.js**
- [ ] **recommendation.service.js**
- [ ] **search.service.js**

### Utils

- [x] **validator.js**
- [x] **ApiError.js**
- [x] **APIResponse.js**
- [x] **AsyncHandler.js**

### Tests

- [ ] **user.test.js**
- [ ] **video.test.js**
- [ ] **like.test.js**
- [ ] **comment.test.js**
- [ ] **subscription.test.js**
- [ ] **playlist.test.js**
- [ ] **post.test.js**

## Tech Stack

- **Node Js**
- **Express Js**
- **MongoDB**
- **Mongoose**
- **Cloudinary**

## Working on

- Post feature
- Playlist feature
- Deletion feature
- Search feature
- Recommendation feature
- Testing
- Deployment

## Future Features

- remove media from cloudinary when user delete file.
