# JHP - Javascript Hypertext Preprocessor
*JHP is like PHP but using javascript
This project is made to help making websites with node.js*


--------------------


### How to Use 
To make a JHP server you need [Node.JS](https://nodejs.org/en/)

After you install Node.JS copy 
   * public_html/
   * server.js
   * config.json
   * package.json
   

Open a CMD and type `npm start`


To execute Node.JS commands, you need to make a file with .jhp extension , and use the tag <jhp>, inside it you can put NodeJs Commands.


Exemple:

`<jhp>
    echo($_FS.readdirSync('.')); //Read the server directory and print in the client screen.
</jhp>`


--------------------

### Dependencies
   * cookies `npm install cookies` (https://github.com/pillarjs/cookies)
   * fs
   * http
   * path
   * mysql

### Configuration
   * To edit Configurations open the config.json
    

#### Address Config
   * **IP** - Server ip
   * **Port** - Server port
   
    
#### Files Config
   * **Server Folder** - Server Folder where will be your .html or .jhp files
   * **Index File** - Index File of your Server
   * **Without Extension** - Remove fil extension from url
   * **Types** - Define type for each Extension
   * **Errors** - Define errors pages
   
    
#### Hash Code
   * Define a Hash Code to your server, when you use $_HASH(string)
  
  
--------------------
  
  
### Tags
    <jhp>(nodejs commands)</jhp> - Executes Node.js commands inside this tag
    <include>(path)</include> - Read and Print a File in the Script
  
  
--------------------
 
    
### Variables
   * **$_FS** - It's the fs from node.js
   * **$_HTTP** - It's the http from node.js
   * **$_CONFIG** - It's the config file of the server
   * **$_GET** - Variable to get GET values
   * **$_POST** - Variable to get POST values
   * **$_URL** - Get the URL after '/'
   * **$_FULLURL** - Get the full URL
   
    
--------------------

    
### Functions
   * **echo(string)** - print a string in the html result `aka echo from php´
   * **mysql_connect(database)** - to connect in a MySql Database
   * **mysql_query(sql)** - to Update or Insert uses
   
      *Exemple:*
        `mysql_query("SELECT * FROM users");`
        
   * **mysql_query(sql,callback(error, rows))** - to Get data from Data Base
   
      *Exemple:*`mysql_query("SELECT * FROM users",function(err,result){
            result.forEach( (result) => {
                echo(result.email + "<br>");
            });
         });`
   
   
--------------------

    
### We are working on
   * Cookie System
   * Session System
   * More shortcuts
   * Visual Studio And Sublime Text Extension to Interpret .jhp file
    
    
--------------------

    
### Our Team
   * ![Hetrodo](https://avatars0.githubusercontent.com/u/48604350?s=60&v=4) Eduardo 'hetrodo' Leite
   * ![Gump](https://avatars3.githubusercontent.com/u/29582336?s=60&v=4) Gustavo 'Gump' Paes
   
   *Help us make this big project, send your Pull Request to join in*
