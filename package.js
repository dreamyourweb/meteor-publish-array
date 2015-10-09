Package.describe({
  name: "orikami:publish-array",
  version: "0.0.1",
  summary: "Publish any array to the client",
  git: "",
  documentation: "README.md"
});

Package.onUse(function(api) {
    api.versionsFrom("1.2.0.2");

    api.use("ecmascript");

    api.addFiles("publish-array.js", "server");
});
