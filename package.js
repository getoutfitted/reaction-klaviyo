Package.describe({
  summary: 'Klaviyo support for Reaction!',
  name: 'getoutfitted:reaction-klaviyo',
  version: '0.1.0',
  git: 'https://github.com/getoutfitted/reaction-klaviyo'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2');
  api.use('meteor-platform');
  api.use('less');
  api.use('http');
  api.use('base64');
  api.use('underscore');
  api.use('standard-minifiers');
  api.use('reactioncommerce:core@0.12.0');
  api.use('reactioncommerce:reaction-router');
  api.use('reactioncommerce:reaction-collections');
  api.use('momentjs:moment@2.10.6');
  api.use('momentjs:twix@0.7.2');

  api.addFiles([
    'common/collections.js'
  ], ['client', 'server']);

  api.addFiles([
    'server/registry.js'
  ], 'server');

  api.addFiles([
    'client/templates/settings/settings.html',
    'client/templates/settings/settings.js',
    'client/templates/dashboard/dashboard.html',
    'client/templates/dashboard/dashboard.js'
  ], 'client');
});
