var mysql = require('mysql');

/* module.exports = con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "teachers",
  database: "courier"
}); */

module.exports = con = mysql.createConnection({
  host: "localhost",
  user: "vpgqwmuyuz",
  password: "R8jVk8ZY7u",
  database: "vpgqwmuyuz"
});  
  
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
