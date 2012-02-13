/*
 * Some helper functions 
 * for dealing with shelby 
 * twitter users
 */

module.exports = {
  is_twitter_user : function(user){
    var is_twitter_user  = false;
    user.authentications.forEach(function(auth){
      is_twitter_user = (auth.provider && auth.provider === 'twitter');
    });
    return is_twitter_user;
  },
  get_twitter_users : function(users){
    var self = this;
    var twitter_users = [];
    users.forEach(function(u){
      if (self.is_twitter_user(u)){
        twitter_users.push(self.get_user_twitter_handle(u));
      }
    });
    return twitter_users;
  },
  get_user_twitter_handle : function(u){
    var twitter_handle;
    u.authentications.forEach(function(auth){
      if (auth.provider && auth.provider === 'twitter'){
        twitter_handle = auth.nickname;
      }
    });
    return twitter_handle;
  },
  get_twitter_user_map : function(users){
    var self = this;
    var map = {};
    users.forEach(function(u){
      if (self.is_twitter_user(u)){
        map[self.get_user_twitter_handle(u)] = u._id.toString();
      }
    });
    return map;
  }
};
