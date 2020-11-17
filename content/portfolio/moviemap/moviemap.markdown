---
type: portfolio
title: Movie Map
startDate: 2020-04-01
endDate: 2020-05-01
author: matthewroseman
projectURL: https://moviemap.io
coverImg: https://moviemap.io/preview.jpg
---

Movie Map is an interactive map built with Leaflet.js on React with an Express backend. I scraped IMDb to get a list of all movies, and their shooting locations around the world. I then hit Google's geocoding API to get location infomation (like latitude/longitude coordinates) and stored all that information in MongoDB. When you view the map location data is clustered based on your zoom level. This is done using [geohashes](https://en.wikipedia.org/wiki/Geohash). For each lat/lon coordinate in the database, I also compute the geohash of that coordiante, and using the prefixes of the geohash, I can quickly look up which locations belong in each cluster. This also allowed me to cache the location clusters, making the map update even faster.
