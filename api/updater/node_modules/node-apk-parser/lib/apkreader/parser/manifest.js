(function() {
  var BinaryXmlParser, ManifestParser;

  BinaryXmlParser = require('./binaryxml');

  ManifestParser = (function() {
    var CATEGORY_LAUNCHER, INTENT_MAIN, NS_ANDROID;

    NS_ANDROID = 'http://schemas.android.com/apk/res/android';

    INTENT_MAIN = 'android.intent.action.MAIN';

    CATEGORY_LAUNCHER = 'android.intent.category.LAUNCHER';

    function ManifestParser(buffer) {
      this.buffer = buffer;
      this.xmlParser = new BinaryXmlParser(this.buffer);
    }

    ManifestParser.prototype.collapseAttributes = function(element) {
      var attr, collapsed, _i, _len, _ref;
      collapsed = Object.create(null);
      _ref = element.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        collapsed[attr.name] = attr.typedValue.value;
      }
      return collapsed;
    };

    ManifestParser.prototype.parseIntents = function(element, target) {
      target.intentFilters = [];
      target.metaData = [];
      return element.childNodes.forEach((function(_this) {
        return function(element) {
          var intentFilter;
          switch (element.nodeName) {
            case 'intent-filter':
              intentFilter = _this.collapseAttributes(element);
              intentFilter.actions = [];
              intentFilter.categories = [];
              intentFilter.data = [];
              element.childNodes.forEach(function(element) {
                switch (element.nodeName) {
                  case 'action':
                    return intentFilter.actions.push(_this.collapseAttributes(element));
                  case 'category':
                    return intentFilter.categories.push(_this.collapseAttributes(element));
                  case 'data':
                    return intentFilter.data.push(_this.collapseAttributes(element));
                }
              });
              return target.intentFilters.push(intentFilter);
            case 'meta-data':
              return target.metaData.push(_this.collapseAttributes(element));
          }
        };
      })(this));
    };

    ManifestParser.prototype.parseApplication = function(element) {
      var app;
      app = this.collapseAttributes(element);
      app.activities = [];
      app.activityAliases = [];
      app.launcherActivities = [];
      app.services = [];
      app.receivers = [];
      app.providers = [];
      app.usesLibraries = [];
      app.metaDatas = [];
      element.childNodes.forEach((function(_this) {
        return function(element) {
          var activity, activityAlias, provider, receiver, service;
          switch (element.nodeName) {
            case 'activity':
              activity = _this.collapseAttributes(element);
              _this.parseIntents(element, activity);
              app.activities.push(activity);
              if (_this.isLauncherActivity(activity)) {
                return app.launcherActivities.push(activity);
              }
              break;
            case 'activity-alias':
              activityAlias = _this.collapseAttributes(element);
              _this.parseIntents(element, activityAlias);
              app.activityAliases.push(activityAlias);
              if (_this.isLauncherActivity(activityAlias)) {
                return app.launcherActivities.push(activityAlias);
              }
              break;
            case 'service':
              service = _this.collapseAttributes(element);
              _this.parseIntents(element, service);
              return app.services.push(service);
            case 'receiver':
              receiver = _this.collapseAttributes(element);
              _this.parseIntents(element, receiver);
              return app.receivers.push(receiver);
            case 'provider':
              provider = _this.collapseAttributes(element);
              provider.grantUriPermissions = [];
              provider.metaData = [];
              provider.pathPermissions = [];
              element.childNodes.forEach(function(element) {
                switch (element.nodeName) {
                  case 'grant-uri-permission':
                    return provider.grantUriPermissions.push(_this.collapseAttributes(element));
                  case 'meta-data':
                    return provider.metaData.push(_this.collapseAttributes(element));
                  case 'path-permission':
                    return provider.pathPermissions.push(_this.collapseAttributes(element));
                }
              });
              return app.providers.push(provider);
            case 'uses-library':
              return app.usesLibraries.push(_this.collapseAttributes(element));
            case 'meta-data':
              return app.metaDatas.push(_this.collapseAttributes(element));
          }
        };
      })(this));
      return app;
    };

    ManifestParser.prototype.isLauncherActivity = function(activity) {
      return activity.intentFilters.some(function(filter) {
        var hasMain;
        hasMain = filter.actions.some(function(action) {
          return action.name === INTENT_MAIN;
        });
        if (!hasMain) {
          return false;
        }
        return filter.categories.some(function(category) {
          return category.name === CATEGORY_LAUNCHER;
        });
      });
    };

    ManifestParser.prototype.parse = function() {
      var document, manifest;
      document = this.xmlParser.parse();
      manifest = this.collapseAttributes(document);
      manifest.usesPermissions = [];
      manifest.permissions = [];
      manifest.permissionTrees = [];
      manifest.permissionGroups = [];
      manifest.instrumentation = null;
      manifest.usesSdk = null;
      manifest.usesConfiguration = null;
      manifest.usesFeatures = [];
      manifest.supportsScreens = null;
      manifest.compatibleScreens = [];
      manifest.supportsGlTextures = [];
      manifest.application = Object.create(null);
      document.childNodes.forEach((function(_this) {
        return function(element) {
          switch (element.nodeName) {
            case 'uses-permission':
              return manifest.usesPermissions.push(_this.collapseAttributes(element));
            case 'permission':
              return manifest.permissions.push(_this.collapseAttributes(element));
            case 'permission-tree':
              return manifest.permissionTrees.push(_this.collapseAttributes(element));
            case 'permission-group':
              return manifest.permissionGroups.push(_this.collapseAttributes(element));
            case 'instrumentation':
              return manifest.instrumentation = _this.collapseAttributes(element);
            case 'uses-sdk':
              return manifest.usesSdk = _this.collapseAttributes(element);
            case 'uses-configuration':
              return manifest.usesConfiguration = _this.collapseAttributes(element);
            case 'uses-feature':
              return manifest.usesFeatures.push(_this.collapseAttributes(element));
            case 'supports-screens':
              return manifest.supportsScreens = _this.collapseAttributes(element);
            case 'compatible-screens':
              return element.childNodes.forEach(function(screen) {
                return manifest.compatibleScreens.push(_this.collapseAttributes(screen));
              });
            case 'supports-gl-texture':
              return manifest.supportsGlTextures.push(_this.collapseAttributes(element));
            case 'application':
              return manifest.application = _this.parseApplication(element);
          }
        };
      })(this));
      return manifest;
    };

    return ManifestParser;

  })();

  module.exports = ManifestParser;

}).call(this);
