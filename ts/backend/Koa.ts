import * as file_system from 'node:fs'; // https://nodejs.org/api/fs.html
import * as http from 'http'; // https://nodejs.org/api/http.html
import Koa from 'koa'; // Koa (https://koajs.com) instead of Express...

const application = new Koa;
application.use((context: any /* Koa 'Context' type */) => {
    if (context.request.url === '/Prison_de_Nantes.json') {
        context.response.set('content-type', 'application/json');
        // A stream is set as response body:
        context.body = file_system.createReadStream('./Prison_de_Nantes.json');
    }
});
http.createServer(application.callback()).listen(1963);
