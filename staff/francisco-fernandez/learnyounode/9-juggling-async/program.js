const http = require('http')
var bl = require('bl')

const[,,url1,url2,url3] = process.argv
const url = [url1,url2,url3]


let str = []

url.forEach((url,index)=>{

    
    http.get(url,function(res){
    
        res.on('data', function(data){
            
            str[index] += data.toString()
            
        })
        res.pipe(bl(function(err,data){
            if(err) throw err
            
            console.log(str[index])
        }))
    })
    
})
