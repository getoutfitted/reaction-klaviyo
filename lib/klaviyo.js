Klaviyo = {};

Klaviyo.registerEvent = function (event) {
  check(event, Object);
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
  _.extend(event, {
    token: klaviyoPackage.settings.api.publicKey
  });
  let stringEvent = JSON.stringify(event);
  let data = Base64.encode(stringEvent);
  try {
    let result = HTTP.get('https://a.klaviyo.com/api/track', {
      data: data
    });
    console.log('result:', result);
  } catch (e) {
    console.log(e);
  }
};


