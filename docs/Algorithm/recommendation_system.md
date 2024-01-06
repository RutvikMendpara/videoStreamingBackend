# Video Recommendation System Algorithm

## Objective

The objective of this algorithm is to recommend videos to users for enhanced engagement with the platform, taking into account various user-specific data.

## User Data

The following user data will be considered for the recommendation system:

- Total time spent on video
- Comments on video
- Subscriptions
- Shares of the video
- Search queries
- Watch history
- Like history
- Based on video category
- Based on video country
- Based on video keyword

## Approaches

The recommendation system will employ the following approaches:

1. **Content-Based Filtering:**
   - Utilize user-specific data (watch history, subscriptions, likes) to recommend similar content.
2. **Collaborative Filtering:**
   - Use collective user behavior data (comments, shares, subscriptions) to recommend videos based on what similar users have enjoyed.
3. **Hybrid Models:**
   - Combine content-based and collaborative filtering for a more comprehensive recommendation system.

## Usage of Recommendation System

The recommendation system will be implemented at:

- Homepage
- Video suggestion feed

## Implementation for New Users

- If the user is new or has seen fewer than a threshold number of videos (default: 5), the following steps will be taken:

  1. The user will be prompted to select a video category.
  2. Videos will be displayed based on the chosen category and the user's country (detected through IP address or geolocation).
  3. Clicking on a video will trigger the display of similar videos based on country, category, keyword, title, and description.

## User Behavior Calculation

### Video Scoring

For calculating the likelihood of a video being liked by a user, the following scoring system will be employed:

- Spend some threshold value (default: 60%) = +3
- Comment on video after threshold value (default: 40%) = +3 (only the first comment counts)
- Like on video after threshold value (default: 30%) = +5
- Subscribe after threshold value (default: 40%) = +5
- Share the video after threshold value (default: 50%) = +5
- Dislike on video after threshold value (default: 40%) = -5
- Skip part of the video = -2
- Stop the video
  - Before 25% of time spent = -5
  - Before 50% of time spent = -2
  - Before 75% of time spent = 0
  - Before 100% of time spent = 0
- If video is from the recommendation feed, and the user clicks on the video = +3
- If video is from the search feed, and the user clicks on the video = +2

### User Scoring

Various user-specific factors will contribute to the scoring of videos:

- User clicked on a video, and user country is the same as the video country = +1
- User clicked on a video, and user language is the same as the video language = +1
- User clicked on a video, and user's liked category is the same as the video category = +1
- User clicked on a video, and user's search keyword is the same as video title keyword and video keyword = +1
- When a user is watching a video, track the total time spent, excluding skipped parts.
