function klaviyoEventCreator(user) {
  return {
    event: 'Test Event',
    properties: {
      'Cost': 45
    },
    customer_properties: {
      $email: user.emails[0].address
    }
  };
}

beforeAll(function () {
  VelocityHelpers.exportGlobals();
});

describe('Klaviyo', function () {
  describe('trackEvent', function () {
    beforeEach(function () {
      spyOn(Meteor, 'call');
      Meteor.users.remove({});
      return ReactionCore.Collections.Packages.remove({});
    });

    it('should have a method named trackEvent', function () {
      expect(Object.keys(Klaviyo)).toContain('trackEvent');
    });

    it('should throw an error when passed anything but an object', function () {
      spyOn(Klaviyo, 'trackEvent').and.callThrough();
      expect(function () {
        Klaviyo.trackEvent('STRING');
      }).toThrow();
      expect(function () {
        Klaviyo.trackEvent(4);
      }).toThrow();
      expect(function () {
        Klaviyo.trackEvent(true);
      }).toThrow();
      expect(function () {
        Klaviyo.trackEvent(undefined);
      }).toThrow();
    });

    it('should throw an error if shop does not have klaviyo', function () {
      const klaviyoPackage = Factory.create('klaviyoPackage');
      const user = Factory.create('user');
      spyOn(ReactionCore, 'getShopId').and.returnValue(Random.id());
      const klaviyoEvent = klaviyoEventCreator(user);
      expect(function () {
        Klaviyo.trackEvent(klaviyoEvent);
      }).toThrowError('403 Access Denied, Klaviyo is not enabled for this shop.');
    });

    it('should throw an error if klaviyo is not enabled', function () {
      const klaviyoPackage = Factory.create('klaviyoPackage', {enabled: false});
      const user = Factory.create('user');
      spyOn(ReactionCore, 'getShopId').and.returnValue(klaviyoPackage.shopId);
      expect(klaviyoPackage.enabled).toBe(false);
      const klaviyoEvent = klaviyoEventCreator(user);
      expect(function () {
        Klaviyo.trackEvent(klaviyoEvent);
      }).toThrowError('403 Access Denied, Klaviyo is not enabled for this shop.');
    });

    it('should throw an error if event has no properties field', function () {
      let klaviyoPackage = Factory.create('klaviyoPackage', {
        'settings.api.publicKey': 'FakeKey',
        'settings.api.privateKey': 'FakeKey'
      });
      const user = Factory.create('user');
      spyOn(ReactionCore, 'getShopId').and.returnValue(klaviyoPackage.shopId);
      let event = klaviyoEventCreator(user);
      let eventWithOutProperties = _.omit(event, 'properties');
      expect(function () {
        Klaviyo.trackEvent(eventWithOutProperties);
      }).toThrowError('403 No Event or Properties were added to object');
    });

    it('should throw an error if event has no properties', function () {
      let klaviyoPackage = Factory.create('klaviyoPackage', {
        'settings.api.publicKey': 'FakeKey',
        'settings.api.privateKey': 'FakeKey'
      });
      const user = Factory.create('user');
      spyOn(ReactionCore, 'getShopId').and.returnValue(klaviyoPackage.shopId);
      let event = klaviyoEventCreator(user);
      let eventWithOutProperties = _.omit(event.properties, 'Cost');
      expect(function () {
        Klaviyo.trackEvent(eventWithOutProperties);
      }).toThrowError('403 No Event or Properties were added to object');
    });

    it('should throw an error if event has no event name', function () {
      let klaviyoPackage = Factory.create('klaviyoPackage', {
        'settings.api.publicKey': 'FakeKey',
        'settings.api.privateKey': 'FakeKey'
      });
      const user = Factory.create('user');
      spyOn(ReactionCore, 'getShopId').and.returnValue(klaviyoPackage.shopId);
      let event = klaviyoEventCreator(user);
      let eventWithOutEventName = _.omit(event, 'event');
      expect(function () {
        Klaviyo.trackEvent(eventWithOutEventName);
      }).toThrowError('403 No Event or Properties were added to object');
    });


    it('should throw an error if api keys are not configurered', function () {
      let klaviyoPackage = Factory.create('klaviyoPackage');
      const user = Factory.create('user');
      let event = klaviyoEventCreator(user);
      spyOn(ReactionCore, 'getShopId').and.returnValue(klaviyoPackage.shopId);
      expect(function () {
        Klaviyo.trackEvent(event);
      }).toThrowError('403 Klaviyo API Keys are not configured');
    });

    it('should call klaviyo/logEvent when it meets all scenarios', function () {
      let klaviyoPackage = Factory.create('klaviyoPackage', {
        'settings.api.publicKey': 'FakeKey',
        'settings.api.privateKey': 'FakeKey'
      });
      const user = Factory.create('user');
      let eventWithAll = klaviyoEventCreator(user);
      spyOn(ReactionCore, 'getShopId').and.returnValue(klaviyoPackage.shopId);
      Klaviyo.trackEvent(eventWithAll);
      expect(Meteor.call).toHaveBeenCalled();
    });
  });
});
