to be able to run the project the best way is to run a docker container with selenium:
theres 2 branches for this project, the other one has some more scraping stuff

``docker run -d -p 4444:4444 -v /dev/shm:/dev/shm selenium/standalone-chrome:3.141.59-vanadium``

then run 
`node fbExample.js` 
or 
`node jobExample.js`