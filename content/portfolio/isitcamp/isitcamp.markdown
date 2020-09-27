---
type: portfolio
title: Is It Camp?
startDate: 2020-02-01
endDate: 2020-02-01
author: matthewroseman
---

IsItCamp is a small website with a list of questions that determine how campy a movie is. It's written with a React frontend, and an Express backend with some Node.js side scripts. While not a very complicated concept (simply a list of yes or no questions, each with a certain score), there was some room to add interesting features.

![Homescreen](./homescreen.png)

One of the interesting bits of this site, is the movie autocomplete. There are about half a million movies out there, and writing a fast autocomplete can get complicated. Some things I'd like to point out about how I wrote the autocomplete for this site...

![Autocomplete](./autocomplete.gif)

Results are sorted primarily by how many IMDb ratings they have, and then by title length
Movies with the same title will have the year they were released appended to their title
The backend code uses a Radix tree, a more efficient data structure for autocomplete than a prefix trie
The Radix tree (or Trie) I used was written from scratch without using any libraries. There are libraries out there that probably could have handled this, but the goal of this project was to learn more about javascript. A more detailed explanation of how I built this can be read in this [blog post](/blog/autocomplete-radix-tree)
