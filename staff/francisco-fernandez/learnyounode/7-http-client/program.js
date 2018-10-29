const http = require('http')

const[,,url] = process.argv

http.get(url,function(res){
    
    res.on('data', function(data){
        console.log(data.toString())
    })
    
})

// var http = require('http')

// http.get(process.argv[2], function (response) {
//   response.setEncoding('utf8')
//   response.on('data', console.log)
//   response.on('error', console.error)
// }).on('error', console.error)