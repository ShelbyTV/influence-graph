var server_confs = {
  'development': {
    port : 3001
  },
  'production' : {
    port : 5001
  }
};

module.exports = server_confs[process.env.NODE_ENV];
