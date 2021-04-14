const express=require('express');
const http=require('http');
const { type } = require('os');

const app=express();
const port=3001;
const server=http.createServer(app);


const socket=require('socket.io');
const io=socket(server);

var MongoClient = require('mongodb').MongoClient;

var rider=[];
var driver=[];
var result=[];
var fair;


app.use(
    express.urlencoded({
      extended: true
    })
  );

app.use(express.json());


//rider endpoint
app.post('/rider',(req,res)=>
{
  
  var s=JSON.parse(JSON.stringify(req.body));
  console.log(s.RName+" is looking for a driver.......");
  rider.push(s);
  
});

//driver endpoint
app.post('/driver',(req,res)=>
{
  var s1=JSON.parse(JSON.stringify(req.body));
  console.log(s1.DName+ " is looking for a rider.......");
  driver.push(s1);

});

//rating endpoint
app.post('/rating',(req,res)=>
{

  MongoClient.connect('mongodb://localhost:27017/DB',{useUnifiedTopology: true}, function (err, client) {
  if (err) throw err

  var db = client.db('DB');
  var myobj =
   { DriverName: req.body.DriverName ,
     Rating: req.body.Rating
   };

  db.collection("Rating").insertOne(myobj, function(err, res) {
    if (err) throw err;
    //console.log("1 document inserted");
    
  });

});

});




function dis(x1,y1,x2,y2)
{
  var xDiff = x1 - x2; 
	var yDiff = y1 - y2;

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}


setInterval(()=>
{
    
     for(var i=0;i<rider.length;i++)
     {

      //  console.log(rider)
        fair=0.0;
        var marker=-1;
        var distance=Number.MAX_VALUE;


        for(var j=0;j<driver.length;j++)
          {
                temp=dis(rider[i].xrc,rider[i].yrc,driver[j].xd,driver[j].yd);
        

                if(temp<distance)
                {
                    distance=temp;
                    marker=j;
                }
          }

                fair=2*distance;

                var output=
                {
                  "Rider" : rider[i].RName,
                  "Driver" : driver[marker].DName,
                  "Carname": driver[marker].car,
                  "Fair": fair
                 };


                result.push(output);

                rider.splice(i,1);
                driver.splice(marker,1);

        }

},5000);


io.on("connection",(socket)=>
{
   
   console.log('Connection established');
   setInterval(()=>
   {
       socket.emit('msg',result);
   },5000);
});


server.listen(port,()=>
{
    console.log("Server is listening on localhost:"+port);
});







