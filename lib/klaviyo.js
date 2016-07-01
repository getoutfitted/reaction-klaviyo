function klaviyoPackageConfigured(klaviyoPackage) {
  if (!klaviyoPackage || !klaviyoPackage.enabled) {
    ReactionCore.Log.error('Klaviyo is not enabled for this shop');
    return false;
  }
  if (!klaviyoPackage.settings || !klaviyoPackage.settings.api || !klaviyoPackage.settings.api.publicKey) {
    ReactionCore.Log.error('Klaviyo API Keys are not configured');
    return false;
  }
  return true;
}


function hasRequiredCustomerInfo(custProps) {
  check(custProps, Object);
  const custKeys = Object.keys(custProps);
  const requiredKeys = ['$id', '$email'];
  const intersection = _.intersection(custKeys, requiredKeys);
  return intersection.length > 0;
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

Klaviyo = {};

Klaviyo.trackEvent = function (event) {
  check(event, Object);
  const klaviyoPackage = ReactionCore.Collections.Packages.findOne({
    name: 'reaction-klaviyo',
    shopId: ReactionCore.getShopId()
  });
  let configured = klaviyoPackageConfigured(klaviyoPackage);
  if (!event.event || !event.properties || Object.keys(event.properties).length <= 0) {
    ReactionCore.Log.error('403 No Event or Properties were passed into Klaviyo object');
    configured = false;
  }
  if (configured) {
    _.extend(event, {
      token: klaviyoPackage.settings.api.publicKey
    });
    const stringEvent = JSON.stringify(event);
    const data = Base64.encode(stringEvent);
    if (hasRequiredCustomerInfo(event.customer_properties)) {
      Meteor.call('klaviyo/logEvent', data);
    } else {
      ReactionCore.Log.warn('Missing Customer $email or $id required by Klaviyo');
    }
  }
};

Klaviyo.trackPerson = function (person) {
  check(person, Object);
  const klaviyoPackage = ReactionCore.Collections.Packages.findOne({
    name: 'reaction-klaviyo',
    shopId: ReactionCore.getShopId()
  });
  let configured = klaviyoPackageConfigured(klaviyoPackage);
  if (!person.properties || Object.keys(person.properties).length <= 0) {
    Reaction.Log.error('403 No Properties were added to Klaviyo Object');
    configured = false;
  }
  if (configured) {
    _.extend(person, {
      token: klaviyoPackage.settings.api.publicKey
    });
    const stringPerson = JSON.stringify(person);
    const data = Base64.encode(stringPerson);
    if (hasRequiredCustomerInfo(event.properties)) {
      Meteor.call('klaviyo/logPerson', data);
    } else {
      ReactionCore.Log.warn('Missing Customer $email or $id required by Klaviyo');
    }
  }
};

Klaviyo.addUserToList = function (productId, email) {
  check(productId, String);
  check(email, String);
  const validEmail = validateEmail(email);
  if (validEmail) {
    Meteor.call('klaviyo/addUserToList', productId, email);
  }
}

Klaviyo.addUserToListDirectly = function (email, listId) {
  check(email, String);
  check(listId, String);
  const validEmail = validateEmail(email);
  if (validEmail) {
    Meteor.call('klaviyo/addUserToListDirectly', email, listId);
  }
}

