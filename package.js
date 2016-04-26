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

  api.addFiles('lib/klaviyo.js');
  api.addFiles([
    'common/collections.js'
  ], ['client', 'server']);

  api.addFiles([
    'server/registry.js',
    'server/methods/klaviyoMethods.js'
  ], 'server');

  api.addFiles([
    'client/templates/settings/settings.html',
    'client/templates/settings/settings.js',
    'client/templates/dashboard/dashboard.html',
    'client/templates/dashboard/dashboard.js'
  ], 'client');
  api.addAssets('images/klaviyo_flow.png', 'client');

  api.export('Klaviyo');
});

Package.onTest(function (api) {
  api.use('sanjo:jasmine');
  api.use('reactioncommerce:core@0.12.0');
  api.use('underscore');
  api.use('random');
  api.use('http');
  api.use('base64');
  api.use('dburles:factory@0.3.10');
  api.use('velocity:html-reporter');
  api.use('velocity:console-reporter');
  api.use('velocity:helpers');
  api.use('reactioncommerce:reaction-factories');
  api.use('getoutfitted:reaction-klaviyo');
  api.addFiles('tests/jasmine/factories/factory.js');
  api.addFiles([
    'tests/jasmine/server/integration/methods/klaviyo.js',
    'tests/jasmine/server/integration/klaviyo.js'
  ], 'server');
});
