const router = require('express').Router();
let fs=require('fs');
const { json } = require('express');

router.route('/').get((req, res) => {
    var data=fs.readFileSync("store.json");
    var response=JSON.parse(data);
    res.send(response);
  
});
router.route('/:e/:h').get((req,res) => {
    let reply={
        coefficient:"",
        initialHeight:"",
        numberOfBounces:"",
        coordinates:[]
    }
  let ans=[];

  const e=req.params.e;//coefficient of restitution
  reply.coefficient=e;
  
  let h=req.params.h;//initial height
  reply.initialHeight=h;

  let c=0;//counter for number of bounces
  let u=0;
  let v;
  let t=0;
  const g=9.8;
  

  let obj={
      y:h,
      t:0,
  }
  ans.push(obj);
  t=Math.sqrt(2*h/g);
  u=Math.sqrt(2*g*h);
  v=e*u;
  h=0;
  

  while(v!=0)
  {
      c++;
      ans.push({
          y:h,
          t:t
      });
      t=t+v/g;
      h=v*v/(2*g);
      ans.push({
          y:h,
          t:t
      })
        t=t+Math.sqrt(2*h/g);
        u=Math.sqrt(2*g*h);
        v=e*u;
        h=0;
    }
  ans.push({
      y:0,
      t:t
  })
  reply.numberOfBounces=c;
  reply.coordinates=ans;
  fs.readFile("store.json","utf8",function(err,data)
  {
      if("error while reading",err)
      console.log(err);
      else{
          var oldData=JSON.parse(data);
          oldData.result.push(reply);
          const newData=JSON.stringify(oldData,null,2);
          fs.writeFile("store.json",newData,function(err)
          {
              if(err)
              console.log("error while writing",err);
              else
              console.log("data added");
          })
      }
  })
  res.send(reply);
}
)


module.exports = router;