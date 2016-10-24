#node-apk-parser
based on **adbkit-apkreader**, add meta data parse feature

**node-apk-parser** provides a [Node.js](http://nodejs.org/) API for extracting information from Android APK files. For example, it allows you to read the `AndroidManifest.xml` of an existing APK file.

## Getting started

Install via NPM:

```bash
npm install --save node-apk-parser
```
### Examples

#### Read the `AndroidManifest.xml` of an APK

```javascript
var util = require('util')
var ApkReader = require('node-apk-parser')

var reader = ApkReader.readFile('HelloApp.apk')
var manifest = reader.readManifestSync()

console.log(util.inspect(manifest, { depth: null }))
```

## API

### ApkReader

#### ApkReader.readFile(file)

Alternate syntax to manually creating an ApkReader instance. Currently, only files are supported, but support for streams might be added at some point.

* **file** The path to the APK file.
* Throws: `Error` on error (e.g. if the file is not valid)
* Returns: An `ApkReader` instance.

#### constructor(file)

Manually construct an `ApkReader` instance. Useful for testing and/or playing around. Normally you would use `ApkReader.readFile(file)` to create the instance.

* **file** The path to the APK file.
* Throws: `Error` on error (e.g. if the file is not valid)
* Returns: N/A

#### reader.readManifestSync()

Synchronously reads and parses the `AndroidManifest.xml` file inside the APK and returns a simplified object representation of it.

* Throws: `Error` (e.g. if parsing was unsuccessful)
* Returns: A JavaScript `Object` representation of the manifest. See example output below:

```javascript
{ versionCode: 1,
  versionName: '1.0',
  package: 'com.cvte.sdk.update',
  usesPermissions: [],
  permissions: [],
  permissionTrees: [],
  permissionGroups: [],
  instrumentation: null,
  usesSdk: { minSdkVersion: 14, targetSdkVersion: 20 },
  usesConfiguration: null,
  usesFeatures: [],
  supportsScreens: null,
  compatibleScreens: [],
  supportsGlTextures: [],
  application: 
   { theme: 'resourceId:0x7f060000',
     label: 'resourceId:0x7f050001',
     icon: 'resourceId:0x7f020000',
     debuggable: true,
     allowBackup: true,
     activities: 
      [ { label: 'resourceId:0x7f050001',
          name: 'com.cvte.sdk.update.MyActivity',
          intentFilters: 
           [ { actions: [ { name: 'android.intent.action.MAIN' } ],
               categories: [ { name: 'android.intent.category.LAUNCHER' } ],
               data: [] } ],
          metaData: [] },
        { theme: 'resourceId:0x1030071',
          name: 'com.cvte.sdk.update.UpdateDialogActivity',
          intentFilters: [],
          metaData: [] } ],
     activityAliases: [],
     launcherActivities: 
      [ { label: 'resourceId:0x7f050001',
          name: 'com.cvte.sdk.update.MyActivity',
          intentFilters: 
           [ { actions: [ { name: 'android.intent.action.MAIN' } ],
               categories: [ { name: 'android.intent.category.LAUNCHER' } ],
               data: [] } ],
          metaData: [] } ],
     services: [],
     receivers: [],
     providers: [],
     usesLibraries: [],
     metaDatas: 
      [ { name: 'MENGYOU_APPKEY',
          value: 'a41a4a18b9a1808e4b88f8beea2ddfd1870866c3' } ] } }
```

#### reader.readXmlSync(path)

Synchronously reads and parses the binary XML file at the given path inside the APK file. Attempts to be somewhat compatible with the DOM API.

* **path** The path to the binary XML file inside the APK. For example, giving `AndroidManifest.xml` as the path would parse the manifest (but you'll probably want to use `reader.readManifestSync()` instead).
* Throws: `Error` (e.g. if parsing was unsuccessful)
* Returns:  A JavaScript `Object` representation of the root node of the XML file. All nodes including the root node have the following properties:
    - **namespaceURI** The namespace URI or `null` if none.
    - **nodeType** `1` for element nodes, `2` for attribute nodes, and `4` for CData sections.
    - **nodeName** The node name.
    - For element nodes, the following additional properties are present:
        * **attributes** An array of attribute nodes.
        * **childNodes** An array of child nodes.
    - For attribute nodes, the following additional properties are present:
        * **name** The attribute name.
        * **value** The attribute value, if possible to represent as a simple value.
        * **typedValue** May be available when the attribute represents a complex value. See [android.util.TypedValue](http://developer.android.com/reference/android/util/TypedValue.html) for more information. Has the following properties:
            - **value** The value, which might `null`, `String`, `Boolean`, `Number` or even an `Object` for the most complex types.
            - **type** A `String` representation of the type of the value.
            - **rawType** A raw integer presentation of the type of the value.
    - For CData nodes, the following additional properties are present:
        * **data** The CData.
        * **typedValue** May be available if the section represents a more complex type. See above for details.

## More information

* [android.util.TypedValue](http://developer.android.com/reference/android/util/TypedValue.html) For more information about value types.
* [Dong Liu's excellent Java-based APK parser](https://github.com/xiaxiaocao/apk-parser), which was used as a reference implementation.
* [A detailed blog port about Android's binary XML format](http://justanapplication.wordpress.com/category/android/android-binary-xml/)
* [Stackoverflow discussion about the topic](http://stackoverflow.com/questions/2097813/how-to-parse-the-androidmanifest-xml-file-inside-an-apk-package)
* [android-apktool](https://code.google.com/p/android-apktool/) The most advanced CLI/Java-based APK tool.
