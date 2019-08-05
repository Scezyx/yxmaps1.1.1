var db = require('./db.js'); 
var sql = 'update user set ? where id=0'
//'select * from user';
//'insert into user set ?'; 
var params={id:2};
db.query(sql,params,(error, results, fields)=>{
  if (error) throw error;
  console.log(results);
});