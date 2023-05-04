var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    else if (request.url.slice(0,7)==='/upload') {
        let filename = "";
        var split=request.url.split('f=');
        if(split[1]){
            split=split[1].split('&')[0];
            filename=split;
        }
        console.log(filename,split);
        if(!filename||filename.indexOf('../')!==-1){
            response.statusCode = 405;
        }else{
            let fPath = request.headers['referer'].split('/').slice(3).join('/');
            console.log(fPath);
        const filepath = decodeURI(fPath)+'/'+decodeURI(filename);
      const ws = fs.createWriteStream(filepath);
      ws.on('error',()=>response.statusCode=500);
      request.pipe(ws);
  
      request.on('end', () => { ws.close();
            response.statusCode = 200;
            response.end('File uploaded successfully');
      });
      return;
    }
    }

    else if (request.url.startsWith('/files')) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        let html = `<style>body {font-family:sans-serif;} a {font-size:20px;}</style><h1>File Manager</h1>
        <script>
        var files=[];
function handleFile(e){
  files=e;
}
function startUp(){
  for(var i=0;i<files.length;i++)handleUpload(files[i]);
}
function handleUpload(f){
  if(f.size<1024||f.size>10737418240)return alert(f.size/1024/1024/1024+" GB is too much!");
  document.body.onbeforeunload=function(){return 1;};
  var xhr=new XMLHttpRequest();
  xhr.onreadystatechange=function(){
    if(this.readyState==4&&this.status==200){
      alert("Uploaded!");
    }
  };
  xhr.upload.addEventListener("progress",function(e){
    let progress=((e.loaded/e.total)||1);
  });
  xhr.open('POST','/upload?f='+f.name,true);
  xhr.send(f);
}
        </script>
        <input id = "file" type="file" onchange="handleFile(this.files);" multiple><button onclick = "startUp();">Upload</button><br />
        <font>Folders are </font><font style = "color:orange">orange</font><font>, files are </font><font style = "color:blue">blue</font><font>. Click on a file to download it. Right click on Images to "Save as".</font><br /><br /><br />`;
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
                    else if (file.toLowerCase().endsWith('.mov') || file.toLowerCase().endsWith('.mp4') ) {
                        html += `<video class="video" src="${pathPiece}/${file}" controls></video><br/>`;
                    } 
                    else if (file.toLowerCase().endsWith('.mp3') || file.toLowerCase().endsWith('.wav') ) {
                        html += `<font style = "font-weight:bold;">${file}</font><br /><audio class="video" src="${pathPiece}/${file}" controls></audio><br/>`;
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
