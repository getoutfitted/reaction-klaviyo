function klaviyoPrivatePackageConfigured(klaviyoPackage) {
  if (!klaviyoPackage || !klaviyoPackage.enabled) {
    ReactionCore.Log.error('Klaviyo is not enabled for this shop');
    return false;
  }
  if (!klaviyoPackage.settings || !klaviyoPackage.settings.api || !klaviyoPackage.settings.api.privateKey) {
    ReactionCore.Log.error('Klaviyo API Keys are not configured');
    return false
  }
  return true;
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

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
      } else if (response.content === '0') {
        let buf = new Buffer(data, 'base64');
        let decoded = JSON.parse(buf.toString());
        ReactionCore.Log.warn('Klaviyo event was not logged', decoded);
      } else {
        ReactionCore.Log.info('Klaviyo event successfully logged');
      }
    });
  },
  'klaviyo/logPerson': function (data) {
    check(data, String);
    HTTP.get('https://a.klaviyo.com/api/identify', {
      params: {
        'data': data
      }
    },
    function (error, response) {
      if (error) {
        let buf = new Buffer(data, 'base64');
        let decoded = JSON.parse(buf.toString());
        ReactionCore.Log.warn('Klaviyo person was not logged', decoded);
      } else if (response.content === '0') {
        let buf = new Buffer(data, 'base64');
        let decoded = JSON.parse(buf.toString());
        ReactionCore.Log.warn('Klaviyo person was not logged', decoded);
      } else {
        ReactionCore.Log.info('Klaviyo person successfully identified');
      }
    });
  },
  'klaviyo/addUserToList': function (productId, email) {
    check(productId, String);
    check(email, String);
    const klaviyoPackage = ReactionCore.Collections.Packages.findOne({
      name: 'reaction-klaviyo',
      shopId: ReactionCore.getShopId()
    });
    const configured = klaviyoPrivatePackageConfigured(klaviyoPackage);
    const validEmail = validateEmail(email);
    let product = ReactionCore.Collections.Products.findOne(productId);
    if (configured && validEmail && product && product.emailListId) {
      HTTP.post(`https://a.klaviyo.com/api/v1/list/${product.emailListId}/members`, {
        params: {
          api_key: klaviyoPackage.settings.api.privateKey,
          email: email,
          confirm_optin: false
        }
      }, function (err, res) {
        if (err) {
          ReactionCore.Log.error('Klaviyo API Error' + err);
        } else {
          ReactionCore.Log.info(`${email} was added to Klaviyo List`);
        }
      });
    } else {
      ReactionCore.Log.warn("Invalid request to add to Klaviyo List");
    }
  },
  'klaviyo/AddKlaviyoListToProduct': function (productId, listId) {
    check(productId, String);
    check(listId, String);
    const klaviyoRoles = ['admin',
                     'owner',
                     'klaviyo',
                     'dashboard/klaviyo'];
    if (Roles.userIsInRole(this.userId, klaviyoRoles, ReactionCore.getShopId())) {
      ReactionCore.Collections.Products.update({
        _id: productId
      }, {
        $set: {
          emailListId: listId
        }
      }, {
        selector: {
          type: 'simple'
        }
      });
    }
  },
  'klaviyo/RemoveKlaviyoListFromProduct': function (productId) {
    check(productId, String);
    const klaviyoRoles = ['admin',
                     'owner',
                     'klaviyo',
                     'dashboard/klaviyo'];
    if (Roles.userIsInRole(this.userId, klaviyoRoles, ReactionCore.getShopId())) {
      ReactionCore.Collections.Products.update({
        _id: productId
      }, {
        $unset: {
          emailListId: ''
        }
      }, {
        selector: {
          type: 'simple'
        }
      });
    }
  },
  'klaviyo/addUserToListDirectly': function (email, listId) {
    check(email, String);
    check(listId, String);
    const klaviyoPackage = ReactionCore.Collections.Packages.findOne({
      name: 'reaction-klaviyo',
      shopId: ReactionCore.getShopId()
    });
    const configured = klaviyoPrivatePackageConfigured(klaviyoPackage);
    const validEmail = validateEmail(email);
    if (configured && validEmail && listId) {
      HTTP.post(`https://a.klaviyo.com/api/v1/list/${listId}/members`, {
        params: {
          api_key: klaviyoPackage.settings.api.privateKey,
          email: email,
          confirm_optin: false
        }
      }, function (err, res) {
        if (err) {
          ReactionCore.Log.error('Klaviyo API Error' + err);
        } else {
          ReactionCore.Log.info(`${email} was added to Klaviyo List`);
        }
      });
    } else {
      ReactionCore.Log.warn("Invalid request to add to Klaviyo List");
    }
  },
});
