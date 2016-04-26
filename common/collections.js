ReactionCore.Schemas.KlaviyoPackageConfig = new SimpleSchema([
  ReactionCore.Schemas.PackageConfig, {
    'settings.api.publicKey': {
      type: String,
      label: 'Klaviyo Public Key',
      optional: true
    },
    'settings.api.privateKey': {
      type: String,
      label: 'Klaviyo Private API Key',
      optional: true
    }
  }
]);
