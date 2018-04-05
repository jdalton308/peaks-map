# Training Peaks Code Test


## Table of Contents

- [Requirements](#requirements)
- [Local Environment](#local)
- [Project Structure](#project)
- [Tools & Technology](#tools)



## Requirements

Please build a single page application to visualize the workout data provided in `workout-data.json`, including a map, a graph, and an algorithm to analyze average power output.

### Algorithm
- Write the most efficient method that finds the "best" 20 minute power effort.
- "Best" is defined as highest continuous average for the given time period.

### User Interface
- Display the gps path on a Map
- Display the power output over time on a graph, using time as the X axis
- When user selects a range of time on the graph, highlight the corresponding range on the map
- Display the 1, 5, 10, 15, and 20 minute "best" efforts

### Hints
The purpose of this test is to demonstrate your understanding of JavaScript web application patterns and best practices, efficient algorithms, and general clean coding habits. We realize this interview question can be a substantial task. To save time, do not focus too much on CSS styling, layouts, boundary use cases, etc. You are free to use whatever frameworks and libraries you like.

### Submission
Please submit your test as an emailed zip file or link to a private repo or private file sharing system. You can also provide a hosted link or it can run locally.



## Local Environment

To run project locally, install packages, then run webpack server:

```bash
### From directory folder...

npm i

npm run dev
```

This should automatically open a window in your default web browser. If it does not automatically open, the address and port should be printed in the consolel



## Project Structure

- `/client/` -  All app files are within this directory
  - `index.html` - The HTML file that the app is bootstrapped from. Any dependencies not bundled using webpack are loaded here
  - `app/` - Folder containing all files used within the Vue app
    - `app.js` - File that initializes the Vue app. Any Vue configurations are done here.
    - `App.vue` - The base component of the Vue app. Any other components can be traced back to this.
    - `store.js` - The initial state of the Vuex store, along with the mutation functions
    - `assets/` - Folder containing both style files and any static assets loaded in the app
    - `components/` - Folder containing all Vue components are defined within here
    - `data/` - Folder containing any static data files
    - `utils/` - Folder containing any shared logic



## Tools and Technology

#### JS
- [Vue.js](https://vuejs.org/)
- [Webpack](https://webpack.js.org/)

#### CSS
- [Scss](http://sass-lang.com/)