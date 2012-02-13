/*
 * Graph Keys
 */

module.exports = {
  _ALL_TOPICS_KEY : 'all_topics',
  _TOPIC_PREFIX : 't:',
  _INFLUENCER_PREFIX : 'i:',
  get_topic_key : function(topic_name){
    return this._TOPIC_PREFIX+topic_name;
  }, 
  get_influencer_key : function(influencer_name){
    return this._INFLUENCER_PREFIX+influencer_name;
  },
  get_all_topics_key : function(){
    return this._ALL_TOPICS_KEY 
  }
};
