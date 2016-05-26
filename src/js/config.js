System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "traceur",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "build/main": [
      "src/js/main"
    ]
  },

  map: {
    "async.parallel": "npm:async.parallel@0.5.2",
    "guardian/iframe-messenger": "github:guardian/iframe-messenger@master",
    "json": "github:systemjs/plugin-json@0.1.2",
    "olado/doT": "github:olado/doT@1.0.1",
    "reqwest": "github:ded/reqwest@1.1.5",
    "text": "github:systemjs/plugin-text@0.0.2",
    "traceur": "github:jmcriffey/bower-traceur@0.0.93",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.93",
    "npm:async.eachof@0.5.2": {
      "async.util.keyiterator": "npm:async.util.keyiterator@0.5.2",
      "async.util.noop": "npm:async.util.noop@0.5.2",
      "async.util.once": "npm:async.util.once@0.5.2",
      "async.util.onlyonce": "npm:async.util.onlyonce@0.5.2"
    },
    "npm:async.parallel@0.5.2": {
      "async.eachof": "npm:async.eachof@0.5.2",
      "async.util.parallel": "npm:async.util.parallel@0.5.2"
    },
    "npm:async.util.isarraylike@0.5.2": {
      "async.util.isarray": "npm:async.util.isarray@0.5.2"
    },
    "npm:async.util.keyiterator@0.5.2": {
      "async.util.isarraylike": "npm:async.util.isarraylike@0.5.2",
      "async.util.keys": "npm:async.util.keys@0.5.2"
    },
    "npm:async.util.parallel@0.5.2": {
      "async.util.isarraylike": "npm:async.util.isarraylike@0.5.2",
      "async.util.noop": "npm:async.util.noop@0.5.2",
      "async.util.restparam": "npm:async.util.restparam@0.5.2"
    }
  }
});
