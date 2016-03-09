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
      }).toThrowError('403');
    });

    it('should throw an error if klaviyo is not enabled', function () {
      const klaviyoPackage = Factory.create('klaviyoPackage', {enabled: false});
      const user = Factory.create('user');
      spyOn(ReactionCore, 'getShopId').and.returnValue(klaviyoPackage.shopId);
      expect(klaviyoPackage.enabled).toBe(false);
      const klaviyoEvent = klaviyoEventCreator(user);
      expect(function () {
        Klaviyo.trackEvent(klaviyoEvent);
      }).toThrowError('403');
    });

    it('should throw an error if event has no properties', function () {
      const klaviyoPackage = Factory.create('klaviyoPackage');
      const user = Factory.create('user');
      let event = klaviyoEventCreator(user);
      event = _.omit(event, 'properties');
      expect(function () {
        Klaviyo.trackEvent(event);
      }).toThrow();
    });

  });
});
