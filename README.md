# What is CrowdSauce?
CrowdSauce, is a social networking application that allows end-users to share and discuss recipes. In many other popular social networking platforms such as Snapchat and Instagram, many end-users use the functionality to post pictures of their food. CrowdSauce seeks to build upon the core idea that users like sharing their food by providing an application that allows users to post pictures of the food they are eating along with a recipe describing how to make it. We see many use cases for this platform notably, college students who are living on a budget have access to all of their friends food creations and how they made them, users sharing satirical images of food that didn’t quite work out, or users sharing their favorite home-recipes with all their friends. Succinctly put, CrowdSauce is a social networking application providing users a platform for sharing and finding recipes from their friends. 

# Dependencies:
1. Node.js - what its all built on
2. npm - Node package manager
3. rethinkdb - the backend databsae
4. grunt-cli - the react task runner
5. All the node packages, run ```$ npm install``` in the project directory.

# Getting Started

To get started with CrowdSauce:

1. Clone the repo

```bash
$ git clone https://github.com/alkalai2/CrowdSauce.git ~/crowdsauce
```
2. Run the RethinkDB daemon
```bash
$ cd ~/crowdsauce && rethinkdb
```
3. In a new terminal emulator process, run the node app
```bash
$ cd ~/crowdsauce && npm start
```
4. Navigate browser to localhost on ports 8080 or 3000 to see the database homepage or the application homepage respectively/

