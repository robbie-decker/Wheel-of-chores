My website's frontend can be accesses at https://robbie-decker.github.io/Wheel-of-chores/.
The backend is on my own Amazon EC2 instance.


### Tech Used
This is a fairly straight forward full stack application. 
- Frontend:
    - HTML
    - CSS
    - Javascript
        - Local Storage (Keeps track of data given to the Wheel).
        - DOM manipulation
        - ES6 modules
        - GET and POST requests
    - Vite
        - A faster module bundler
    - Pakages
        - D3
            - Library used to render and operate the wheel.
        - Axios
            - Library used to send GET and POST request to my backend server.
        - Micromodal
            - Small package for showing the modals used.
        - Fireworks-js
            - A fun package for showing fireworks
- Backend:
    - Nodejs
        - Routes
        - HTTPS server
    - Express
    - MongoDB with MongoDB Atlas
        - Database
    - Mongoose
        - Tool interacting with MongoDB
    - SSL
        - I just recently added a SSL authentication to the site to allow for
        HTTPS traffic

### Commands for Amazon EC2 instance
May have to run commands below with `sudo`
- Start
    `pm2 start index.js`
- Stop
    `pm2 stop index.js`

Of course you could also just stop the entire instance as well,  but that will probably change the
public IP.