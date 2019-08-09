const $_HTTP = require('http');
const $_FS = require('fs');
const $_PATH = require('path')
const $_CONFIG = require('./config.json');
const $_MYSQL = require('mysql');

var $_POST;
var $_GET;
var $_REQUEST;
var $_REQUESTURL;
var $_REMOTEADDR;
var $_EVAL_BUFFER;

var mysql;

const $_SERVER = $_HTTP.createServer((_SYSTEMREQUEST, _SYSTEMRESPONSE) => {
    var $_STATUS = 200;

    $_REQUEST = _SYSTEMREQUEST.url.split('?')[0];
    $_REQUESTURL =  $_CONFIG.address.port != 80 ? $_CONFIG.address.ip + ":" + $_CONFIG.address.port + $_REQUEST : $_CONFIG.address.ip + $_REQUEST;
    $_REMOTEADDR = _SYSTEMREQUEST.connection.remoteAddress;

    $_GET = {};
    if(_SYSTEMREQUEST.url.includes('?')){
        for(var i = 0; i < _SYSTEMREQUEST.url.split('?')[1].split("&").length; i++)
            $_GET[_SYSTEMREQUEST.url.split('?')[1].split('=')[0]] = _SYSTEMREQUEST.url.split('?')[1].split('=')[1]; 
    }
    
    var $_POSTString = "";
    _SYSTEMREQUEST.on("data", function (chunk) {
        $_POSTString += chunk;
        $_POST = {};

        for(var i = 0; i < $_POSTString.split('&').length; i++)
            $_POST[$_POSTString.split('&')[i].split('=')[0]] = $_POSTString.split('&')[i].split('=')[1];
        
    });

    //Validate request
    if($_FS.existsSync($_CONFIG.files.server_folder + "/" + $_REQUEST)){
        //Open dir index
        if($_FS.lstatSync($_CONFIG.files.server_folder + "/" + $_REQUEST).isDirectory())
            $_REQUEST += "/" + $_CONFIG.files.index_file;

        //Escape request
        $_REQUEST = _ESCAPEREQUEST($_REQUEST);

        //whitelist check
        var d_whitel = $_CONFIG.files.whitelist[$_PATH.dirname($_REQUEST)];
        var f_whitel = $_CONFIG.files.whitelist[$_PATH.basename($_REQUEST)];
        
        if(d_whitel == "block" || f_whitel == "block"){
            $_REQUEST = $_CONFIG.files.errors['403'];
            $_STATUS = 200;
        }

        if(!$_FS.existsSync($_CONFIG.files.server_folder + "/" + $_REQUEST))
            _THROW404();

    }
    else _THROW404();

    //append server directory
    $_REQUEST = _ESCAPEREQUEST($_CONFIG.files.server_folder + "/" + $_REQUEST);

    _SYSTEMREQUEST.on("end", function(){
        $_URLEXT = $_REQUEST.split('.')[1];
        _SYSTEMRESPONSE.writeHead($_STATUS, {'Content-Type': $_CONFIG.files.types[$_URLEXT] || $_CONFIG.files.types['txt']});
        _SYSTEMRESPONSE.end(_SYSTEMREADFILE($_REQUEST));
    });
});

$_SERVER.listen($_CONFIG.address.port, $_CONFIG.address.ip, () => {
    console.log(" ");
    console.log("                 JHP Server Started!");
    console.log(`   Your server is running in http://${$_CONFIG.address.ip}:${$_CONFIG.address.port}`);
    console.log("   Help us in GitHub: https://github.com/GumpFlash/jhp");
    console.log(" ");
});

function _THROW404()
{
    $_REQUEST = $_CONFIG.files.server_folder + "/" + $_CONFIG.files.errors['404'];
    $_STATUS = 404;
}

function _ESCAPEREQUEST(str){
    var result = "";

    for(var i = 0; i < str.length; i++)
        if(str[i] == "/" && str[i-1] != "/")
            result += str[i];
        else if(str[i] != "/")
            result += str[i];

    return result;
}

function _SYSTEMREADFILE(file){
    var $_CONTENT = "";
    try{
        const ext = file.split('.')[1];
        if(ext == "jhp")
            $_CONTENT = _SYSTEMRUNJHP($_FS.readFileSync(file).toString());
        else
            $_CONTENT = Buffer.from($_FS.readFileSync(file),'utf_8');
    
    }catch(e){
        $_CONTENT = e.toString(); 
    }
    return $_CONTENT;
}

function _SYSTEMRUNJHP($_SYSTEMFILE){
    var $_FILECONTENT = $_SYSTEMFILE;

    var $_JHPCODE = $_GETBETWEEN($_FILECONTENT, "<jhp>", "</jhp>");

    for(var $_SYSTEMX = 0; $_SYSTEMX < $_JHPCODE.length; $_SYSTEMX++){
        //Get all include tags
        var $_JHPINCLUDE = $_GETBETWEEN($_JHPCODE[$_SYSTEMX], "<include>", "</include>");

        //Loop through all tags
        for(var $_INCLUDE_INDEX = 0; $_INCLUDE_INDEX < $_JHPINCLUDE.length; $_INCLUDE_INDEX++){
            //Read tag's target file and get its jhp code
            var tempcode = $_GETBETWEEN($_FS.readFileSync($_JHPINCLUDE[$_INCLUDE_INDEX]).toString(), "<jhp>", "</jhp>");

            for(var tempcodeI = 0; tempcodeI < tempcode.length; tempcodeI++){
                //Replace the previous loaded code into the original requested code
                var updatedCode = $_JHPCODE[$_SYSTEMX].replace("<include>" + $_JHPINCLUDE[$_INCLUDE_INDEX] + "</include>", tempcode[tempcodeI]);
                $_FILECONTENT = $_FILECONTENT.replace($_JHPCODE[$_SYSTEMX], updatedCode);
                $_JHPCODE[$_SYSTEMX] = updatedCode;
            }
        }

        //"Compile" code
        try{ echo(eval($_JHPCODE[$_SYSTEMX])); } catch(e){ echo(e.toString()); }
        $_FILECONTENT = $_FILECONTENT.toString().replace("<jhp>" + $_JHPCODE[$_SYSTEMX] + "</jhp>", $_GET_EVAL_BUFFER());
    }

    if($_FILECONTENT.includes("<jhp>") || $_FILECONTENT.includes("</jhp>"))
        console.log("[Warning] The result still has jhp tags inside it.");

    return Buffer.from($_FILECONTENT, 'utf8');
}

function $_HASH(txt,seed){
    if(seed == undefined)
        seed = $_CONFIG.hashCode;

    var _SYSTEMHASHRETURN = 0;
    for(var i = 0; i < txt.length; i++){
        var _SYSTEMHASHVALUE = Math.round(Math.sqrt(txt.charCodeAt(i) + i * Math.cos(i * seed)) * 1000000000000 * Math.round(seed * Math.PI));
        _SYSTEMHASHRETURN += _SYSTEMHASHVALUE;
    }
    _SYSTEMHASHRETURN = _SYSTEMHASHRETURN.toString(16);
    var max = _SYSTEMHASHRETURN.length;
    while(max % 4 != 0){
        max++;
    }
    var _SYSTEMHASHRETURN2 = "";
    for(var i = 0; i < max; i++){
        if(i % 4 == 0 && i != 0)
            _SYSTEMHASHRETURN2 += "-";
        if(_SYSTEMHASHRETURN[i] != undefined)
            _SYSTEMHASHRETURN2 += _SYSTEMHASHRETURN[i];
        else
            _SYSTEMHASHRETURN2 += "0";
    }
    return _SYSTEMHASHRETURN2;
}

function $_GETBETWEEN(str, tag0, tag1){
    var Results = [];

    var closed = true;
    var fo = 0;

    for(var i = 0; i < str.length; i++){
        var tag0_match = "";
        for(var j = 0; j < tag0.length; j++){
            if((i+j) < str.length)
                tag0_match += str[i+j];
            else
                break;
        }


        var tag1_match = "";
        for(var j = 0; j < tag1.length; j++){
            if((i+j) < str.length)
                tag1_match += str[i+j];
            else
                break;
        }


        if(tag0_match == tag0 && closed){
            closed = false;
            fo = i + (tag0.length-1);
        }
        if(tag1_match == tag1 && !closed){
            Results.push(str.substring(fo + 1, i));
            closed = true;
        }
    }

    return Results;
}

function echo(str){
    if($_EVAL_BUFFER == undefined)
        $_EVAL_BUFFER = [];

    $_EVAL_BUFFER.push(str);
}

function $_GET_EVAL_BUFFER(){
    var temp = $_EVAL_BUFFER;
    $_EVAL_BUFFER = [];
    return temp.join("");
}

function mysql_connect(database){
    try{
        mysql = $_MYSQL.createConnection({
            host: $_CONFIG['sql']['host'],
            user: $_CONFIG['sql']['user'],
            password: $_CONFIG['sql']['password'],
            database: database
        });

        mysql.connect((err) => {
            if (err) echo(err.sqlMessage);
        });
    }catch(e){
        echo(e);
    }
}

function mysql_query(sql,callback){
    if(callback == undefined) mysql.query(sql);
    else mysql.query(sql, callback);
}