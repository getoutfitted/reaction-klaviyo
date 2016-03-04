Template.klaviyoSettings.helpers({
  packageData: function () {
    return ReactionCore.Collections.Packages.findOne({
      name: 'reaction-klaviyo',
      shopId: ReactionCore.getShopId()
    });
  }
});

AutoForm.hooks({
  'klaviyo-update-form': {
    onSuccess: function (operation, result, template) {
      Alerts.removeSeen();
      return Alerts.add('Klaviyo settings saved.', 'success', {
        autoHide: true
      });
    },
    onError: function (operation, error, template) {
      Alerts.removeSeen();
      return Alerts.add('Klaviyo settings update failed. ' + error, 'danger');
    }
  }
});
