# Seekers

Connecting people seeking lost personal possessions.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Tech stack used: React JS(Front End), Node JS(Back End), FaunaDB(Database), Netlify(Web Host).

## Demo

![Gif Demo of https://seekers.netlify.app/](https://media.giphy.com/media/5h7vhAZCBDHmg0j0Sy/giphy.gif)

Check out the [youtube demo](https://youtu.be/zZg7QdkT2jo) and the [webpage](https://seekers.netlify.app/).

Want to skip creating an account? View the page instead [here](https://crowdseek.ml/).

## Description

Seekers is a platform that allows users to share information about where personal possessions were lost or/and found. With LeafletJS, we provide the option for users to select the location where the item was lost/found on a map and create a post with their relevant information. Additionally, users can browse existing posts that are stored on a FaunaDB database.

## Technology Choice

We used ReactJS because of its extensive libraries, support and seamless flow with NodeJS which we were most comfortable developing the backend in. FaunaDB and Netlify are both pieces of software that are easy to use and work in tandem to deploy a website.

We implemented backend calls to the database using serverless functions (Netlify Functions) as it was easier and more effective for our use case instead of setting up a server.

## Challenges

Because we both wanted to learn the full stack of development, we decided to swap roles (front-end <-> back-end) midway through the project in order to maxmize learning. The downside was that we spent more time catching up with what the other person had coded and understanding the work.

## Team Members - Who we are

We are Andrei and Lucas, 2 University of Waterloo Computer Science undergraduate students with a strong passion for the tech industry. See our other projects below:

Lucas Wang: https://github.com/LucasWangTO
Andrei Gliga: https://github.com/hyp3rion123

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The serverless functions are running at [http://localhost:9000](http://localhost:9000).
