My website's frontend can be accesses at https://robbie-decker.github.io/Wheel-of-chores/.
The backend is on my own Amazon EC2 instance.

### Commands for instance
- Start
    pm2 start index.js
- Stop
    pm2 stop index.js

Of course you could also just stop the entire instance as well,  but that will probably change the
public IP.