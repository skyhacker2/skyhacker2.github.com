(function() {
  var ApkReader, BinaryXmlParser, ManifestParser, Zip;

  Zip = require('adm-zip');

  ManifestParser = require('./apkreader/parser/manifest');

  BinaryXmlParser = require('./apkreader/parser/binaryxml');

  ApkReader = (function() {
    var MANIFEST;

    MANIFEST = 'AndroidManifest.xml';

    ApkReader.readFile = function(apk) {
      return new ApkReader(apk);
    };

    function ApkReader(apk) {
      var err;
      this.apk = apk;
      try {
        this.zip = new Zip(this.apk);
      } catch (_error) {
        err = _error;
        if (typeof err === 'string') {
          throw new Error(err);
        } else {
          throw err;
        }
      }
    }

    ApkReader.prototype.readManifestSync = function() {
      var manifest;
      if (manifest = this.zip.getEntry(MANIFEST)) {
        return new ManifestParser(manifest.getData()).parse();
      } else {
        throw new Error("APK does not contain '" + MANIFEST + "'");
      }
    };

    ApkReader.prototype.readXmlSync = function(path) {
      var file;
      if (file = this.zip.getEntry(path)) {
        return new BinaryXmlParser(file.getData()).parse();
      } else {
        throw new Error("APK does not contain '" + path + "'");
      }
    };

    return ApkReader;

  })();

  module.exports = ApkReader;

}).call(this);
