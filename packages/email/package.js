Package.describe({
  summary: "Send email messages"
});

Package.on_use(function (api) {
  api.add_files('email.js', 'server');
});
