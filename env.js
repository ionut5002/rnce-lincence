const fs = require('fs');

if (fs.existsSync('./public')) {
  process.env.NODE_ENV = 'production';
  process.env.databaseUri = 'mongodb://rnce2018:ionut5002@ds219318.mlab.com:19318/rnce'; // Databse URI and database name
  process.env.databaseName = 'production database: rnce'; // Database name
} else {
  process.env.NODE_ENV = 'development';
  process.env.databaseUri = 'mongodb://rnce2018:ionut5002@ds219318.mlab.com:19318/rnce'; // Databse URI and database name
  process.env.databaseName = 'production database: rnce'; // Database name
}


process.env.Gmail = 'richardnolanapp@gmail.com';

process.env.clientId= '863492255929-itanoopij3oj9vm3tjmpjj97suooocbm.apps.googleusercontent.com',
process.env.clientSecret= 'KgmXnS9QDy1U5Bp--Waeya0m',
process.env.refreshToken= '1/in8vm-gFkG4XRn7BSrNb-U-FqhS2ZxgaW1okPdKY0RCQnQ13K_aNCcoEQS-U0nZm'
// mongodb://rnce2018:ionut5002@ds219318.mlab.com:19318/rnce (official)
// mongodb://rnce2018:ionut5002@ds219000.mlab.com:19000/test-rnce (test)
