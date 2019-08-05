var db={}
var mysql= require('mysql');

var pool = mysql.createPool({
  host     : '129.28.162.50',
  user     : 'root',
  password : 'kdm001',
  port: '3306',
  database : 'yxmaps'
});

/**查询 */
db.query = function(sql,params,callback){ 
  
  if (!sql) { 
    callback(); 
    return; 
  } 
  pool.query(sql,params,function(err, rows, fields) { 
   if (err) { 
    console.log(err); 
    callback(err, null); 
    return; 
   }; 
  
   callback(null, rows, fields); 
  }); 
} 
module.exports = db; 