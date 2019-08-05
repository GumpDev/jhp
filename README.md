# JHP - Javascript Hypertext Preprocessor
*JHP it's is like PHP but to Node.Js
This project it's made to help make website with node.js*


--------------------


### How to Use 
To make a JHP server you need [Node.JS](https://nodejs.org/en/)


After you install Node.JS copy 
   * public_html/
   * server.js
   * config.json
   * package.json
   

Open a CMD and type `npm start`


For compile the Node.JS commands, you need make a file with extension .jhp, and open the tag <jhp>, inside it you can put NodeJs Commands.


Exemple:
`<jhp>
    echo($_FS.readdirSync('.')); //Will read the server directory and print in the client screen.
</jhp>`


--------------------


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
 
    
### Variables
   * **$_FS** - It's the fs from node.js
   * **$_HTTP** - It's the http from node.js
   * **$_CONFIG** - It's the config file of the server
   * **$_GET** - It's GET values
   * **$_POST** - It's POST values
   * **$_URL** - Get the URL after '/'
   * **$_FULLURL** - Get the full URL
   
    
--------------------

    
### Functions
   * **echo(string)** - It's print a string in the client screen
   
   
--------------------

    
### We are working on
   * Include Command
   * MySql Server
   * MySql Compatible
   * More error pages
   * Visual Studio And Sublime Text Extension to Interpret .jhp file
    
    
--------------------

    
### Our Team
   * ![Hetrodo](https://avatars0.githubusercontent.com/u/48604350?s=60&v=4) Eduardo 'hetrodo' Leite
   * ![Gump](https://avatars3.githubusercontent.com/u/29582336?s=60&v=4) Gustavo 'Gump' Paes
   
   *Help us make this big project, send your Pull Request to join in*
