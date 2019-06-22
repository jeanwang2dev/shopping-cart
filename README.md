# Shopping-cart project

This is an online-shopping website base on a WCC course. This project is built using MEAN Stack, AJAX and Bootstrap3.

Project Online demo is at [https://shoppingcartproject.xyz](https://shoppingcartproject.xyz)

You can Re-Create the Project on Digital Ocean

## Getting Started

#### Setting up the environment your server

 1. Create a droplet with Ubuntu operating system under your Digital Ocean account
 2. Root login after receiving the email from Digital Ocean with `ssh root@your ip address`
 3. Create a New User with `adduser USERNAME`
 4. Add your new user to the sudo group with `usermod -aG sudo USERNAME`
 
    **Note** : remember to log out and login with your new user. shouldn't run node with root. 
    
 5. You can also setup SSH access to the droplet, more info [here](https://www.digitalocean.com/docs/droplets/how-to/add-ssh-keys/)
 6. Set up the ufw firewall, more info [here](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-16-04)
 7. Install node.js and npm on Ubuntu
 8. Installing MongoDB and secure it, more info [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-mongodb-on-ubuntu-16-04)
 
#### Create collections in Mongodb

 1. Login to Mongodb with the admin user you created before `mongo -u USERNAME -p --authenticationDatabase admin`
 2. Create your database and add a user to the database 
 ```
 show dbs
use classProject
db
db.createUser(
... {
...    user: "DB_USER",
...     pwd: "DB_PASS",
...    roles: [ {role: "readWrite", db: "DB_NAME" } ]
... });
```
 3. Then Logout Mongodb, login with the new user you created, then create four collections for the project.
 ```
 mongo -u CharlotteHale -p --authenticationDatabase classProject
db
use classProject
show collections
db.createCollection('admins');
db.createCollection('products');
db.createCollection('customers');
db.createCollection('orders');
```
4. Create a initial first admin user and log out
```
db.admins.insert({ username: "firstuser", password: "$2b$10$90FnudVyfAwjiaRfETKvQunWB2/Fy4/jJBOJnGMCTXHh5LFnvdb6a"});
```
you can confirm the insert with `db.admins.find().pretty()`

**NOTE:** the password is using bcrypt hashing function to compute.

#### Set up the Website 

1. Git clone the repo to your sever
2. Create .env file and put in your MongoDB information 
**NOTE** the env file has not simicolon or other pucuation, it looks like
```
PORT = XXXX
DB_HOST = XXX.X.X.X
DB_NAME = Your DB NAME
DB_USER = Your DB UserName
DB_PASS = Your DB Password
```

3. in the directory of the project run `npm install`
4. then run `node index.js` you should see 
```
Server up : http://YOURSERVERIP:PORT
Mongoose Connected.
```
you can visit the webiste from the browser by typing `http://yourserverip:port`



 

