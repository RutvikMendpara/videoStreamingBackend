users [icon: user] {
id string pk
username string
fullName string
email string
avatar string
coverImage string
watchHistory ObjectId[] videos
password string
refreshToken string
creartedAt timestamp
updatedAt timestamp
}

videos [icon: video] {
id string pk
videoFile string
thumbnail string
title string
description string
duration number
views number
isPublished boolean
owner ObjectId[] users
country string
keywords array[string]
category string
creartedAt timestamp
updatedAt timestamp
}

userBehavior [icon: machine-learning] {
id string pk
user ObjectId[] users
video ObjectId[] videos
watchTime number
action enum
country string
category string
creartedAt timestamp
updatedAt timestamp
}

subscription [icon: user-check] {
id string pk
subscriber ObjectId[] users
channel ObjectId[] users
creartedAt timestamp
updatedAt timestamp
}

searchLog [icon: search] {
id string pk
query string
user ObjectId[] users
country string
category string
creartedAt timestamp
updatedAt timestamp
}

post [icon: messenger] {
id string pk
owner ObjectId[] users
content string
creartedAt timestamp
updatedAt timestamp
}

playlist [icon: bookmark] {
id string pk
name string
description string
videos ObjectId[] videos
owner ObjectId[] users
isPublic boolean
creartedAt timestamp
updatedAt timestamp
}

like [icon: thumbs-up] {
id string pk
video ObjectId[] videos
comment ObjectId[] comments
likedBy ObjectId[] users
post ObjectId[] posts
creartedAt timestamp
updatedAt timestamp
}

comment [icon: comment] {
id string pk
content string
video string
owner string
creartedAt timestamp
updatedAt timestamp
}

users.watchHistory <> videos.id
userBehavior.user < users.id
userBehavior.video < videos.id
subscription.subscriber <> users.id
subscription.channel <> users.id
searchLog.user < users.id
post.owner < users.id
playlist.videos <> videos.id
playlist.owner < users.id
like.video < videos.id
like.comment < comment.id
like.likedBy <> users.id
like.post < users.id
comment.owner < users.id
comment.video < videos.id
