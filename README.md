# WebFaas - Plugin - PackageRegistry - Disk

WebFaaS Plugin for [node](http://nodejs.org).

[![NPM Version][npm-image]][npm-url]
[![Linux Build][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

### Config - Complete
```json
{
    "registry.disk": [
        {
            "name": "[registry name]",
            "base": "[folder path]"
        }
    ]
}
```

### Example
```javascript
"use strict";

import * as path from "path";

import { ModuleManager } from "@webfaas/webfaas-core";

import { PackageRegistry } from "../lib/PackageRegistry";
import { PackageRegistryConfig } from "../lib/PackageRegistryConfig";

var moduleManager = new ModuleManager();
var foldeTarball = path.join(__dirname.substring(0, __dirname.length - "examples".length), "test/data/data-package");
moduleManager.getModuleManagerImport().getPackageStoreManager().getPackageRegistryManager().addRegistry("disk", "", new PackageRegistry(new PackageRegistryConfig(foldeTarball)));

(async function(){
    try {
        var moduleObj: any = await moduleManager.getModuleManagerImport().import("@webfaaslabs/mathsum", "0.0.1", undefined, "disk");
        
        if (moduleObj){
            console.log("module loaded", moduleObj);
            console.log("2 = 3 => ", moduleObj(2,3));
        }
        else{
            console.log("module not loaded");
        }
    }
    catch (errTry) {
        console.log("errExample: ", errTry);
    }
})();
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@webfaas/webfaas-plugin-packageregistry-disk.svg
[npm-url]: https://npmjs.org/package/@webfaas/webfaas-plugin-packageregistry-disk

[travis-image]: https://img.shields.io/travis/webfaas/webfaas-plugin-packageregistry-disk/master.svg?label=linux
[travis-url]: https://travis-ci.org/webfaas/webfaas-plugin-packageregistry-disk

[coveralls-image]: https://img.shields.io/coveralls/github/webfaas/webfaas-plugin-packageregistry-disk/master.svg
[coveralls-url]: https://coveralls.io/github/webfaas/webfaas-plugin-packageregistry-disk?branch=master