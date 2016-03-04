ReactionCore.registerPackage({
  label: 'Klaviyo',
  name: 'reaction-klaviyo',
  icon: 'fa fa-email',
  autoEnable: false,
  registry: [{
    route: '/dashboard/klaviyo',
    provides: 'dashboard',
    name: 'klaviyo',
    label: 'Klaviyo',
    description: 'Klaviyo email campagin and tracking',
    container: 'getoutfitted',
    icon: 'fa fa-email',
    template: 'klaviyoDashboard',
    workflow: 'coreWorkflow',
    priority: 1
  }, {
    route: '/dashboard/klaviyo/settings',
    provides: 'settings',
    label: 'Klaviyo Settings',
    name: 'klaviyoSettings',
    template: 'klaviyoSettings'
  }]
});