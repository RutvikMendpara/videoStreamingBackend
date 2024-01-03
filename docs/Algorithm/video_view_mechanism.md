# Algorithm: Video View Mechanism

## Video View Mechanism:

- When a user starts watching a video, record the timestamp.
- Calculate view threshold based on playback speed.
  - View threshold = 60% of video duration / playback speed.
- Track unique views considering the 24-hour gap since the last view.
- Store views temporarily.

## Update View Count:

- Periodic checks based on subscriber counts.
- Move views from temporary storage to actual views after a defined period.

## Store View Data:

- Maintain separate databases for temporary and actual views.

## Handle Bots and Automated Views:

- Collect IP address, user agent, and OS version.
- Identify and disregard views from IPs exhibiting suspicious patterns (e.g., repeated views with short gaps).

## User Actions for Recommendation:

- Consider user actions such as total time spent, likes, comments, subscriptions, shares, search, and watch history for enhancing the recommendation model.

## Unique Views:

- Views are partially unique, considering a 24-hour gap since the last view.

## Adjusting for Playback Speed:

- Support playback speeds of 0.25x, 0.5x, 1x, 1.25x, 1.5x, 1.75x, 2x.

## Video Skips:

- Exclude skipped portions from the total time spent calculation.

## Temporary vs. Actual View:

- Store views temporarily; update to actual views after a designated time period.

## Addressing IP-Based Bots:

- Collect and analyze IP, user agent, and OS data.
- Disregard views from IPs showing bot-like behavior.

## User Privacy:

- Ensure user data privacy; use data anonymously for enhancing user experience.

## Logging and Monitoring:

- Implement a robust logging and monitoring system for view count actions.

## User Feedback:

- Establish a user feedback loop to enhance the recommendation model and user experience.
