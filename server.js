const http = require('http');
const fs = require('fs');

const config = require('./config.json');
const Regex = require("regex");

const server = http.createServer((req, res) => {
    const responses = [];
    var files = fs.readdirSync(config.files.serverFolder);
    for(var i = 0; i < files.length; i++){

        var content = fs.readFileSync(config.files.serverFolder + "/" + files[i]);

        if(files[i].split('.')[1].toLowerCase() == "jhp"){
            try{
                var assoc = [];
                var values = content.toString().match(/<jhp>(.*?)<\/jhp>/g).map(function(val){
                    assoc.push(val);
                    return val.replace(/<\/?jhp>/g,'');
                });

                for(var x = 0; x < assoc.length; x++){
                        content = content.toString().replace(assoc[x],eval(values[x]));
                    if(eval(values[x]) == undefined || eval(values[x]) == null){
                        content = content.toString().replace('undefined','');
                        content = content.toString().replace('null','');
                    }
                }
            }catch(e){
                
            }
        }
        
        if(config.files.withoutExtension.includes(files[i].split('.')[1]))
            responses['/'+files[i].split('.')[0]] = content;
        else
            responses['/'+files[i]] = content;

    }
    
    responses['/'] = fs.readFileSync(config.files.serverFolder + "/" + config.files.index_file);

    res.end(responses[req.url] || responses['/404']);
})

server.listen(config.address.port, config.address.ip, () => {
  console.log(`Servidor rodando em http://${config.address.ip}:${config.address.port}`);
  console.log('Para derrubar o servidor: ctrl + c');
})