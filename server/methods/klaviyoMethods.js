Meteor.methods({
  'klaviyo/logEvent': function (data) {
    check(data, String);
    HTTP.get('https://a.klaviyo.com/api/track', {
      params: {
        'data': data
      }
    },
      function (error, response) {
        if (error) {
          let buf = new Buffer(data, 'base64');
          let decoded = JSON.parse(buf.toString());
          ReactionCore.Log.warn('Klaviyo event was not logged', decoded);
        } else {
          ReactionCore.Log.info('Klaviyo event successfully logged');
        }
      });
  }
});
