const $_HTTP = require('http');
const $_FS = require('fs');
const $_CONFIG = require('./config.json');
const $_RESPONSES = [];

var $_POST;
var $_GET;
var $_URL;

const $_SERVER = $_HTTP.createServer((_SYSTEMREQUEST, _SYSTEMRESPONSE) => {
    _SYSTEMMAPFOLDER($_CONFIG.files.server_folder);

    $_URL = _SYSTEMREQUEST.url.split('?')[0];

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

    $_REMOTEADDR = _SYSTEMREQUEST.connection.remoteAddress;

    $_RESPONSES['/'] = $_CONFIG.files.server_folder + "/" + $_CONFIG.files.index_file;
    _SYSTEMREQUEST.on("end", function(){
        if($_RESPONSES[$_URL] != undefined){
            $_URLEXT = $_RESPONSES[$_URL].split('.')[1];
            _SYSTEMRESPONSE.writeHead(200, {'Content-Type': $_CONFIG.files.types[$_URLEXT] || $_CONFIG.files.types['txt']});
        }else
            _SYSTEMRESPONSE.writeHead(200, {'Content-Type': $_CONFIG.files.types['html']});

        if($_RESPONSES[$_URL] != undefined)
            _SYSTEMRESPONSE.end(_SYSTEMREADFILE($_RESPONSES[$_URL]));
        else
            _SYSTEMRESPONSE.end(_SYSTEMREADFILE($_RESPONSES[$_CONFIG.files.errors['404']]));
    });
});

$_SERVER.listen($_CONFIG.address.port, $_CONFIG.address.ip, () => {
    console.log(" ");
    console.log("                 JHP Server Started!");
    console.log(`   Your server is running in http://${$_CONFIG.address.ip}:${$_CONFIG.address.port}`);
    console.log("   Help us in GitHub: https://github.com/GumpFlash/jhp");
    console.log(" ");
});

function _SYSTEMMAPFOLDER(folder){
    const $_DIR = $_FS.readdirSync(folder);
    const $_FOLDERNAME = folder.split($_CONFIG.files.server_folder)[1];
    for(var _dirX = 0; _dirX < $_DIR.length; _dirX++){
        if($_DIR[_dirX].includes(".")){
            $_EXTENSION = $_DIR[_dirX].split('.')[1];

            if($_CONFIG.files.without_extension.includes($_EXTENSION))
                $_RESPONSES["/"+$_FOLDERNAME+$_DIR[_dirX].split('.')[0]] = folder + $_DIR[_dirX];
            else
                $_RESPONSES["/"+$_FOLDERNAME+$_DIR[_dirX]] = folder + $_DIR[_dirX];
        }else
            _SYSTEMMAPFOLDER(folder + $_DIR[_dirX] + "/");
    }
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

    var $_JPHCODE = $_GETBETWEEN($_FILECONTENT, "<jhp>", "</jhp>");

    for(var $_SYSTEMX = 0; $_SYSTEMX < $_JPHCODE.length; $_SYSTEMX++){
        try{ eval($_JPHCODE[$_SYSTEMX]); } catch(e){ echo(e.toString()); }
        $_FILECONTENT = $_FILECONTENT.toString().replace($_JPHCODE[$_SYSTEMX], $_GET_EVAL_BUFFER());
    }

    while($_FILECONTENT.includes("<jhp>") || $_FILECONTENT.includes("</jhp>"))
        $_FILECONTENT = $_FILECONTENT.replace("<jhp>", "").replace("</jhp>", ""); 

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

function $_GETBETWEEN(str, tag0, tag1)
{
    var Results = [];

    var closed = true;
    var fo = 0;

    for(var i = 0; i < str.length; i++)
    {
        var tag0_match = "";
        for(var j = 0; j < tag0.length; j++)
        {
            if((i+j) < str.length)
                tag0_match += str[i+j];
            else
                break;
        }


        var tag1_match = "";
        for(var j = 0; j < tag1.length; j++)
        {
            if((i+j) < str.length)
                tag1_match += str[i+j];
            else
                break;
        }


        if(tag0_match == tag0 && closed)
        {
            closed = false;
            fo = i + (tag0.length-1);
        }
        if(tag1_match == tag1 && !closed)
        {
            Results.push(str.substring(fo + 1, i));
            closed = true;
        }
    }

    return Results;
}

var $_REMOTEADDR = "";
var $_EVAL_BUFFER = [];

function echo(str)
{
    $_EVAL_BUFFER.push(str);
}

function $_GET_EVAL_BUFFER()
{
    var temp = $_EVAL_BUFFER;
    $_EVAL_BUFFER = [];
    return temp.join("");
}