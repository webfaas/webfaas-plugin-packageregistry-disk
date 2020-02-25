"use strict";

import * as path from "path";

import { ModuleManager } from "@webfaas/webfaas-core";

import { PackageRegistry } from "../lib/PackageRegistry";
import { PackageRegistryConfig } from "../lib/PackageRegistryConfig";

var moduleManager = new ModuleManager();
var foldeTarball = path.join(__dirname.substring(0, __dirname.length - "examples".length), "test/data/data-package");
moduleManager.getPackageStoreManager().getPackageRegistryManager().addRegistry("disk", "", new PackageRegistry(new PackageRegistryConfig(foldeTarball)));

(async function(){
    try {
        var moduleObj: any = await moduleManager.import("@webfaaslabs/mathsum", "0.0.1", undefined, "disk");
        
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