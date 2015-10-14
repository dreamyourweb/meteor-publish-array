Package.describe({
  name: "orikami:publish-array",
  version: "0.0.1",
  summary: "Publish any array to the client",
  git: "https://github.com/dreamyourweb/meteor-publish-array.git",
  documentation: "README.md"
});

Package.onUse(function(api) {
    api.versionsFrom("1.2.0.2");

    api.use([
        "ecmascript",
        "underscore"
    ]);

    api.addFiles("publish-array.js", "server");
});
