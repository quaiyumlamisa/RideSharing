
const io=require('socket.io-client');
let socket=io.connect('http://localhost:3001');

const axios=require('axios')
var ridercount=0;
var drivercount=0;

var rname;
var dname;
var car;


function random(max,min)
{
   return Math.random() * (max - min) + min;
}

function getInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}


setInterval(()=>
{
   ridercount++;
   rname='Rider'+ridercount;

  
    axios({
        method: 'post',
        url: 'http://localhost:3001/rider',
        data: {
                RName: rname, 
                xrc: random(1.1,99.8),
                yrc:random(1.1,99.8),
                xrd:random(1.1,99.8),
                yrd:random(1.1,99.8)
              }
         })



    .then(res => 
      
      {
         k
         console.log(res)
      })


    .catch(error =>
       {
         console.error(error)
       })

    
  
      },1000);


  setInterval(()=>
{
   drivercount++;
   dname='Driver'+drivercount;
   car='c'+drivercount;

  
    axios({
        method: 'post',
        url: 'http://localhost:3001/driver',
        data: {
                DName: dname, 
                car: car,
                xd:random(1.1,99.8),
                yd:random(1.1,99.8)
              }
         })



    .then(res => 
      {
     
       console.log(res)
      })


    .catch(error =>
      
    {
      console.error(error)
    })

    
  
  },1000);



 


  
var count=0;
socket.on("msg",(data)=>
{

    console.log(data[count].Rider+" has found "+ data[count].Driver+" and fair is "+data[count].Fair);
    


    axios({
      method: 'post',
      url: 'http://localhost:3001/rating',
      data: {
              DriverName:data[count].Driver,
              Rating: getInteger(0,5)
            }
       })
  
  
  
  .then(res => 
    {
    
     console.log(res)
    })
  
  
  .catch(error =>
    
  {
    console.error(error)
  })

  count++;

});


 
