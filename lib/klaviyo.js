function klaviyoPackageConfigured(klaviyoPackage) {
  if (!klaviyoPackage || !klaviyoPackage.enabled) {
    throw new Error('403 Access Denied, Klaviyo is not enabled for this shop.');
  }
  if (!klaviyoPackage.settings || !klaviyoPackage.settings.api || !klaviyoPackage.settings.api.publicKey) {
    throw new Error('403 Klaviyo API Keys are not configured');
  }
}
Klaviyo = {};

Klaviyo.trackEvent = function (event) {
  check(event, Object);
  let klaviyoPackage = ReactionCore.Collections.Packages.findOne({
    name: 'reaction-klaviyo',
    shopId: ReactionCore.getShopId()
  });
  klaviyoPackageConfigured(klaviyoPackage);
  if (!event.event || !event.properties || Object.keys(event.properties).length <= 0) {
    throw new Error('403 No Event or Properties were added to object');
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
  klaviyoPackageConfigured(klaviyoPackage);
  // if (Object.keys(person).length < 0)
  _.extend(person, {
    token: klaviyoPackage.settings.api.publicKey
  });
  let stringPerson = JSON.stringify(person);
  let data = Base64.encode(stringPerson);
  Meteor.call('klaviyo/logPerson', data);
};


