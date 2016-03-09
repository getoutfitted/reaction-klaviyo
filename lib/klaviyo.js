Klaviyo = {};

Klaviyo.trackEvent = function (event) {
  check(event, Object);
  let klaviyoPackage = ReactionCore.Collections.Packages.findOne({
    name: 'reaction-klaviyo',
    shopId: ReactionCore.getShopId()
  });
  if (!klaviyoPackage || !klaviyoPackage.enabled) {
    throw new Error(403, 'Access Denied, Klaviyo is not enabled for this shop.');
  }
  if (!event.event && Object.keys(event.properties).length > 0) {
    throw new Error('No Event or Properties were added to object');
  }
  if (!klaviyoPackage.settings || !klaviyoPackage.settings.api || !klaviyoPackage.settings.api.publicKey) {
    throw new Error('Klaviyo api Keys are not configured!');
  }
  _.extend(event, {
    token: klaviyoPackage.settings.api.publicKey
  });
  let stringEvent = JSON.stringify(event);
  let data = Base64.encode(stringEvent);
  Meteor.call('klaviyo/logEvent', data);
};

Klaviyo.trackPerson = function (person) {
  check(person, Object);
  let klaviyoPackage = ReactionCore.Collections.Packages.findOne({
    name: 'reaction-klaviyo',
    shopId: ReactionCore.getShopId()
  });
  if (!klaviyoPackage) {
    throw new Error('Klaviyo not found!');
  }
  if (!klaviyoPackage.settings || !klaviyoPackage.settings.api) {
    throw new Error('Klaviyo api Keys are not configured!');
  }
  _.extend(person, {
    token: klaviyoPackage.settings.api.publicKey
  });
  let stringPerson = JSON.stringify(person);
  let data = Base64.encode(stringPerson);
  Meteor.call('klaviyo/logPerson', data);
};


