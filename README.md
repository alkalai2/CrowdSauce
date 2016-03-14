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

