const $_HTTP = require('http');
const $_FS = require('fs');
const $_CONFIG = require('./config.json');
const $_RESPONSES = [];

const $_SERVER = $_HTTP.createServer((_SYSTEMREQUEST, _SYSTEMRESPONSE) => {
    _SYSTEMMAPFOLDER($_CONFIG.files.server_folder);

    $_RESPONSES['/'] = $_CONFIG.files.server_folder + "/" + $_CONFIG.files.index_file;
    
    if($_RESPONSES[_SYSTEMREQUEST.url] != undefined){
        $_URLEXT = $_RESPONSES[_SYSTEMREQUEST.url].split('.')[1];
        _SYSTEMRESPONSE.writeHead(200, {'Content-Type': $_CONFIG.files.types[$_URLEXT] || $_CONFIG.files.types['txt']});
    }else
        _SYSTEMRESPONSE.writeHead(200, {'Content-Type': $_CONFIG.files.types['html']});

    if($_RESPONSES[_SYSTEMREQUEST.url] != undefined)
        _SYSTEMRESPONSE.end(_SYSTEMREADFILE($_RESPONSES[_SYSTEMREQUEST.url]));
    else
        _SYSTEMRESPONSE.end(_SYSTEMREADFILE($_RESPONSES[$_CONFIG.files.errors['404']]));
});

$_SERVER.listen($_CONFIG.address.port, $_CONFIG.address.ip, () => {
    console.log(`Your server is running in http://${$_CONFIG.address.ip}:${$_CONFIG.address.port}`);
    console.log('To stop: ctrl + c');
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
    var $_ASSOCTAGSFILE = [];

    if($_FILECONTENT.split("<jhp>").length > 1){
        var $_SYSTEMJHPVALUES = $_FILECONTENT.toString().match(/<jhp>(.|\s)*<\/jhp>/).map(function(val){
            $_ASSOCTAGSFILE.push(val);
            return val.replace(/<\/?jhp>/g,'');
        });
    }
    for(var $_SYSTEMX = 0; $_SYSTEMX < $_SYSTEMJHPVALUES.length; $_SYSTEMX++){
        eval($_SYSTEMJHPVALUES[$_SYSTEMX]);
        $_FILECONTENT = $_FILECONTENT.toString().replace($_ASSOCTAGSFILE[$_SYSTEMX],'');
    }

    $_ASSOCTAGSFILE = [];
    if($_FILECONTENT.split("<jhs>").length > 1){
        var $_SYSTEMJHPVALUES = $_FILECONTENT.toString().match(/<jhs>(.*?)<\/jhs>/g).map(function(val){
            $_ASSOCTAGSFILE.push(val);
            return val.replace(/<\/?jhs>/g,'');
        });
    }
    for(var $_SYSTEMX = 0; $_SYSTEMX < $_SYSTEMJHPVALUES.length; $_SYSTEMX++){
        var $_FILERESULT = eval($_SYSTEMJHPVALUES[$_SYSTEMX]);
        $_FILECONTENT = $_FILECONTENT.toString().replace($_ASSOCTAGSFILE[$_SYSTEMX],$_FILERESULT.toString().replace('undefined',''));
    }

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