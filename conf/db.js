var db_confs = {
  'development' : {
    db_name : 'nos-development',
    host : 'localhost',
    port : 27017,
    redis : {
      host : '127.0.0.1',
      port : 6379
    },
    max_users_chunk : 1
  },
  'production' : {
    db_name : 'nos-production',
    host : '10.183.192.15',
    port : 27018,
    redis : {
      host : '127.0.0.1',
      port : 6379
    },
    max_users_chunk : 1000
  }
};

module.exports = db_confs[process.env.NODE_ENV];
