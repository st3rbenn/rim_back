# **Welcome to Rim API**
([link to the mobile app](https://github.com/st3rbenn/rim_web))
> Rim for Receive Instant Message
## What's this project ?
The goal of this project was to learn how to create an api using MySQL, Node.JS, Express, Sequelize and JWT.

## How to install and run The API
First you need to clone this project running this command : 

    git clone https://github.com/st3rbenn/rim_back

now run : 

    cd rim_back
    touch .env
    code . //if you turn on shell command to run VSCode or open project manually

then write in the .env file your local MySQL credentials like : 

    PORT=3001
    DB_HOST=localhost
    DB_USER=root
    DB_PORT=3306
    DB_PASSWORD= //if you use password
    DB_NAME=rim
    DB_CONNECTION_LIMIT=10
   
   since you've done all that stuff run : 
   

    yarn // i recommend to use yarn at npm
    yarn dev

now the API should be launch

try it at this url: http://localhost:3001/api/v1/

The documentation comming soon
