ReactionCore.Schemas.KlaviyoPackageConfig = new SimpleSchema([
  ReactionCore.Schemas.PackageConfig, {
    'settings.api.publicKey': {
      type: String,
      label: 'Public facing key that can be included in code',
      optional: true
    },
    'settings.api.privateKey': {
      type: String,
      label: 'Private API key for more hidden code',
      optional: true
    }
  }
]);
