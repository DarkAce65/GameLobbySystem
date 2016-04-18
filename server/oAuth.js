var configure = function(services) {
  if (services) {
    for (service in services) {
      ServiceConfiguration.configurations.upsert( { service: service }, {
        $set: services[ service ]
      });
    }
  } else {
    throw new Meteor.Error('bad-oauth-configuration', 'No services defined')
  }
}

configure(Meteor.settings.private.oAuth)
