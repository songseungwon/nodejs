var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js')
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname;
    

    if(pathname=='/' && !title){
      var title = 'welcome';
      fs.readdir('./data', function(error, filelist){
        var list = template.List(filelist);
        fs.readFile(title, 'utf8', function(err, description){
          var HTML = template.HTML(title, list,
            `<a href="/create">create</a>`,
            `<h3 style="margin-top:30px;">${title}</h1>
            <p>${description}</p>`);
          response.writeHead(200);
          response.end(HTML);
        })
      })
    } else if(pathname== '/'){
      fs.readdir('./data', function(error, filelist){
        var list = template.List(filelist);
        fs.readFile(`data/${title}`, 'utf8', function(err, description){
          var HTML = template.HTML(title, list,
            `<a href="/update?id=${title}">update</a>
             <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
             </form>`,
            `<h3 style="margin-top:30px;">${title}</h1>
            <p>${description}</p>`);
        response.writeHead(200);
        response.end(HTML);
        })
      })
    } else if(pathname== '/create'){
      var title = 'welcome';
      fs.readdir('./data', function(error, filelist){
        var list = template.List(filelist);
        fs.readFile(title, 'utf8', function(err, description){
        var HTML = template.HTML(title, list,'',
        `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
        </form>
        <h3 style="margin-top:30px;">${title}</h1>
        <p>${description}</p>
        `);
        response.writeHead(200);
        response.end(HTML);
        })
      })
    } else if(pathname== '/create_process') {
      var body = '';
      request.on('data', function(data){
        body = body + data;
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      });
    } else if(pathname=='/update'){
      fs.readdir('./data', function(error, filelist){
        var list = template.List(filelist);
        fs.readFile(`data/${title}`, 'utf8', function(err, description){
        var HTML = template.HTML(title, list,'',
        `
        <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value=${title}></p>
            <p>
              <textarea name="description" placeholder="description" value=${description}></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
        </form>
        <h3 style="margin-top:30px;">${title}</h1>
        <p>${description}</p>
        `);
        response.writeHead(200);
        response.end(HTML);
        })
      })
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        })
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
        if(body.length > 1e6){
          request.connection.destroy();
        }
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`, function(error){
          response.writeHead(302, {Location: `/`});
            response.end();
        })
      });
    }else {
      response.writeHead(404);
      response.end('NOT FOUND');
    }
 
});
app.listen(3000);