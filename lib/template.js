var template = {
    HTML: function(title, list, control, body){
      return `
          <!DOCTYPE html>
          <html lang="ko">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>WEB1 - ${title}</title>
          </head>
          <body>
          <h1><a href="/">WEB1</a></h1>
          <div id="grid">
              ${list}
              ${control}
              <div id="article">
                  ${body}
              </div>
          </div>
          </body>
          </html>
          `;
    }, List: function(filelist){
      var list = '<ul>';
        var i = 0;
        while(i < filelist.length){
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
          i = i + 1;}
      return list;
    }
  }

module.exports = template;