import * as chai from "chai";

import * as os from "os";
import * as fs from "fs";
import * as path from "path";

import { Log, LogLevelEnum } from "@webfaas/webfaas-core";

import { PackageRegistry } from "../lib/PackageRegistry";
import { PackageRegistryConfig } from "../lib/PackageRegistryConfig";

var log = new Log();
log.changeCurrentLevel(LogLevelEnum.OFF);

var folderNotPermited = path.join(os.tmpdir(), "notpermited_") + new Date().getTime();
fs.mkdirSync(folderNotPermited)
fs.chmodSync(folderNotPermited, "000");
var packageRegistry_foldernotpermited = new PackageRegistry();
packageRegistry_foldernotpermited.getConfig().base = folderNotPermited;

describe("Package Registry", () => {
    var packageRegistry_default = new PackageRegistry();
    packageRegistry_default.getConfig().base = path.join(__dirname, "data/data-package");
    var packageRegistry_full = new PackageRegistry(new PackageRegistryConfig(path.join(__dirname, "data/data-package")), log);
    
    it("should return properties", function(){
        chai.expect(packageRegistry_default.getTypeName()).to.eq("disk");
        chai.expect(packageRegistry_full.getTypeName()).to.eq("disk");
        chai.expect(typeof(packageRegistry_full.getConfig())).to.eq("object");
    })
})

describe("Package Registry - getPackage", () => {
    var packageRegistry_default = new PackageRegistry();
    packageRegistry_default.getConfig().base = path.join(__dirname, "data/data-package");

    it("getPackage - @webfaaslabs/mathsum 0.0.1", async function(){
        let packageRegistryResponse1 = await packageRegistry_default.getPackage("@webfaaslabs/mathsum", "0.0.1");
        let eTag: string = "";
        chai.expect(packageRegistryResponse1).to.not.null;
        if (packageRegistryResponse1){
            let packageStore = packageRegistryResponse1.packageStore;
            chai.expect(packageStore).to.not.null;
            if (packageStore){
                eTag = packageStore.getEtag();
                chai.expect(packageStore.getEtag().length).to.gte(0);

                let manifest = packageStore.getManifest();
                chai.expect(manifest).to.not.null;
                if (manifest){
                    chai.expect(manifest.name).to.eq("@webfaaslabs/mathsum");
                    chai.expect(manifest.version).to.eq("0.0.1");
                    chai.expect(manifest.notfound).to.eq(undefined);
                }
            }
        }

        //retry with etag
        let packageRegistryResponse2 = await packageRegistry_default.getPackage("@webfaaslabs/mathsum", "0.0.1", eTag);
        chai.expect(packageRegistryResponse2).to.not.null;
        chai.expect(packageRegistryResponse2.packageStore).to.null;
        chai.expect(packageRegistryResponse2.etag).to.eq(eTag);
    })

    it("getPackage - semver 5.6.0", async function(){
        let packageRegistryResponse1 = await packageRegistry_default.getPackage("semver", "5.6.0");
        let eTag: string = "";
        chai.expect(packageRegistryResponse1).to.not.null;
        if (packageRegistryResponse1){
            let packageStore = packageRegistryResponse1.packageStore;
            chai.expect(packageStore).to.not.null;
            if (packageStore){
                eTag = packageStore.getEtag();
                chai.expect(packageStore.getEtag().length).to.gte(0);

                let manifest = packageStore.getManifest();
                chai.expect(manifest).to.not.null;
                if (manifest){
                    chai.expect(manifest.name).to.eq("semver");
                    chai.expect(manifest.version).to.eq("5.6.0");
                    chai.expect(manifest.notfound).to.eq(undefined);
                }
            }
        }

        //retry with etag
        let packageRegistryResponse2 = await packageRegistry_default.getPackage("semver", "5.6.0", eTag);
        chai.expect(packageRegistryResponse2).to.not.null;
        chai.expect(packageRegistryResponse2.packageStore).to.null;
        chai.expect(packageRegistryResponse2.etag).to.eq(eTag);
    })

    it("getPackage - file not found", async function(){
        let packageRegistryResponse = await packageRegistry_default.getPackage("notfound***", "1.0.0");
        chai.expect(packageRegistryResponse.etag).to.eq("");
        chai.expect(packageRegistryResponse.packageStore).to.be.null;
    })

    it("getPackage - folder not permited", async function(){
        try {
            let packageRegistryResponse = await packageRegistry_foldernotpermited.getPackage("notfound***", "1.0.0");
            throw new Error("Sucess!");
        }
        catch (error) {
            chai.expect(error.code).to.eq("EACCES");
        }
    })
})

describe("Package Registry - getManifest", () => {
    var packageRegistry_default = new PackageRegistry();
    packageRegistry_default.getConfig().base = path.join(__dirname, "data/data-package");

    it("getManifest - @webfaaslabs/mathsum", async function(){
        let packageRegistryResponse1 = await packageRegistry_default.getManifest("@webfaaslabs/mathsum");
        let eTag: string = "";
        
        chai.expect(packageRegistryResponse1).to.not.null;
        if (packageRegistryResponse1){
            let packageStore = packageRegistryResponse1.packageStore;
            chai.expect(packageStore).to.not.null;
            if (packageStore){
                eTag = packageStore.getEtag();
                chai.expect(packageStore.getEtag().length).to.gte(0);

                let manifest = packageStore.getManifest();
                chai.expect(manifest).to.not.null;
                if (manifest){
                    chai.expect(manifest.name).to.eq("@webfaaslabs/mathsum");
                    chai.expect(manifest.version).to.eq(undefined);
                    chai.expect(manifest.notfound).to.eq(undefined);
                }
            }
        }

        //retry with etag
        let packageRegistryResponse2 = await packageRegistry_default.getManifest("@webfaaslabs/mathsum", eTag);
        chai.expect(packageRegistryResponse2).to.not.null;
        chai.expect(packageRegistryResponse2.packageStore).to.null;
        chai.expect(packageRegistryResponse2.etag).to.eq(eTag);
    })

    it("getManifest - semver", async function(){
        let packageRegistryResponse1 = await packageRegistry_default.getManifest("semver");
        let eTag: string = "";
        
        chai.expect(packageRegistryResponse1).to.not.null;
        if (packageRegistryResponse1){
            let packageStore = packageRegistryResponse1.packageStore;
            chai.expect(packageStore).to.not.null;
            if (packageStore){
                eTag = packageStore.getEtag();
                chai.expect(packageStore.getEtag().length).to.gte(0);

                let manifest = packageStore.getManifest();
                chai.expect(manifest).to.not.null;
                if (manifest){
                    chai.expect(manifest.name).to.eq("semver");
                    chai.expect(manifest.version).to.eq(undefined);
                    chai.expect(manifest.notfound).to.eq(undefined);
                }
            }
        }

        //retry with etag
        let packageRegistryResponse2 = await packageRegistry_default.getManifest("semver", eTag);
        chai.expect(packageRegistryResponse2).to.not.null;
        chai.expect(packageRegistryResponse2.packageStore).to.null;
        chai.expect(packageRegistryResponse2.etag).to.eq(eTag);
    })

    it("getManifest - file not found", async function(){
        let packageRegistryResponse = await packageRegistry_default.getManifest("notfound***");
        chai.expect(packageRegistryResponse.etag).to.eq("");
        chai.expect(packageRegistryResponse.packageStore).to.be.null;
    })

    it("getManifest - folder not permited", async function(){
        try {
            let packageRegistryResponse = await packageRegistry_foldernotpermited.getManifest("notfound***");
            throw new Error("Sucess!");
        }
        catch (error) {
            chai.expect(error.code).to.eq("EACCES");
        }
    })
})