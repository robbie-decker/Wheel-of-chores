My website's frontend can be accesses at https://robbie-decker.github.io/Wheel-of-chores/.
The backend is on my own Amazon EC2 instance.

### Commands for instance
- Start
    `pm2 start index.js`
- Stop
    `pm2 stop index.js`

Of course you could also just stop the entire instance as well,  but that will probably change the
public IP.


### Tech Used
This is a fairly straight forward full stack application. 
- Frontend:
    - HTML
    - CSS
    - Javascript
    - Vite
    - D3
        - Library used to render and operate the wheel
    - Axios
        - Library used to send GET and POST request to my backend server
    - Micromodal
        - Small package for showing the modals used
    - Fireworks-js
        - A fun package for showing fireworks
- Backend:
    - Nodejs
    - Express
    - MongoDB
        - Database
    - Mongoose
        - Tool interacting with MongoDB
