# **Welcome to Rim API**
([link to the mobile app](https://github.com/st3rbenn/rim_web))
> Rim for Receive Instant Message
## What's this project ?
It's a mobile app where you can follow, share message and post with your friend simply and quickly and 
the goal of this project was to learn how to create an api using MySQL, Node.JS, Express, Sequelize and JWT.

## How to install and run The API
First you need to clone the project running this command : 

    git clone https://github.com/st3rbenn/rim_back

now run : 

    cd rim_back
    touch .env
    code . //if you turn on shell command to run VSCode or open project manually
    
don't forget to generate a RSA/SSH key for the JWT Auth middleware : 
    [RSA Key for Windows 10/11](https://www.howtogeek.com/762863/how-to-generate-ssh-keys-in-windows-10-and-windows-11/) or 
    [SSH Key for MacOS](https://docs.tritondatacenter.com/public-cloud/getting-started/ssh-keys/generating-an-ssh-key-manually/manually-generating-your-ssh-key-in-mac-os-x)

put those keys in the folder config/jwt and : 
  - rename the private key to "mykey"
  - rename the public key to pubkey"

then write in the .env file your local MySQL credentials like : (first you have to create a db in MySQL) 

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
