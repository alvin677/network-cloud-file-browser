var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {

    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }
    else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        let html = '<style>body {font-family:sans-serif;} a {font-size:20px;}</style><h1>File Manager</h1><font>Folders are </font><font style = "color:orange">orange</font><font>, files are </font><font style = "color:blue">blue</font><font>. Click on a file to download it. Right click on Images to "Save as".</font><br /><br /><br />';
        filePath = decodeURI(filePath);
        fs.readdir(filePath, (err, files) => {
            try {
            files.forEach(file => {
                let splitpath = filePath.split("/"); let pathPiece = splitpath[splitpath.length-1];
                if (!fs.lstatSync(filePath+'/'+file).isDirectory()) {
                    if (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.gif') ) {
                        html += `<img class="img" src="${pathPiece}/${file}" /><br/>`;
                    } 
                    else if (file.toLowerCase().endsWith('.txt') || file.toLowerCase().endsWith('.md')) {
                        let data = fs.readFileSync(filePath+'/'+file, { encoding: 'utf8', flag: 'r' });
                        html += `<a class="file" style="color:blue;" href="${pathPiece}/${file}">${file}:</a><br /><font class="text">${data}</font><br/><br />`;
                    }
                    else {
                        html += `<a class="file" style="color:blue;" href="${pathPiece}/${file}">${file}</a><br/>`; // Is file and not png, jpg or gif
                    }
                } else { html += `<a class="folder" style="color:orange;" href="${pathPiece}/${file}">${file}</a><br/>`;} // Is directory
            });
            response.write(html);
            response.end()
        }catch(e) {}});
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(80);