var http = require('http')
var map = require('through2-map')

const[,,port] = process.argv

uc = map(function(chunk){
    return chunk.toString().toUpperCase()
})

server = http.createServer( function callback (request, response){

    if (request.method == 'POST') request.pipe(uc).pipe(response)
    
    
})
server.listen(port)