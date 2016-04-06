function klaviyoPackageConfigured(klaviyoPackage) {
  if (!klaviyoPackage || !klaviyoPackage.enabled) {
    throw new Error('403 Access Denied, Klaviyo is not enabled for this shop.');
  }
  if (!klaviyoPackage.settings || !klaviyoPackage.settings.api || !klaviyoPackage.settings.api.publicKey) {
    throw new Error('403 Klaviyo API Keys are not configured');
  }
}

function hasRequiredCustomerInfo(custProps) {
  check(custProps, Object);
  let custKeys = Object.keys(custProps);
  let requiredKeys = ['$id', '$email'];
  let intersection = _.intersection(custKeys, requiredKeys);
  return intersection.length > 0;
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
    throw new Error('403 No Event or Properties were passed into Klaviyo object');
  }

  _.extend(event, {
    token: klaviyoPackage.settings.api.publicKey
  });
  let stringEvent = JSON.stringify(event);
  let data = Base64.encode(stringEvent);
  if (hasRequiredCustomerInfo(event.customer_properties)) {
    Meteor.call('klaviyo/logEvent', data);
  } else {
    ReactionCore.Log.warn('Missing Customer $email or $id required by Klaviyo');
  }
};

Klaviyo.trackPerson = function (person) {
  check(person, Object);
  let klaviyoPackage = ReactionCore.Collections.Packages.findOne({
    name: 'reaction-klaviyo',
    shopId: ReactionCore.getShopId()
  });
  klaviyoPackageConfigured(klaviyoPackage);
  if (!person.properties || Object.keys(person.properties).length <= 0) {
    throw new Error('403 No Properties were added to Klaviyo Object');
  }
  _.extend(person, {
    token: klaviyoPackage.settings.api.publicKey
  });
  let stringPerson = JSON.stringify(person);
  let data = Base64.encode(stringPerson);
  if (hasRequiredCustomerInfo(event.properties)) {
    Meteor.call('klaviyo/logPerson', data);
  } else {
    ReactionCore.Log.warn('Missing Customer $email or $id required by Klaviyo');
  }
};


