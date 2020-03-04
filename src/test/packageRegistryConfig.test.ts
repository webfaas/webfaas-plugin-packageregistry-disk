import * as chai from "chai";
import { PackageRegistryConfig } from "../lib/PackageRegistryConfig";

describe("Package Registry Config", () => {
    it("config1 - should return properties", function(){
        var config_1 = new PackageRegistryConfig("folder1");
        chai.expect(config_1.base).to.eq("folder1");
    })

    it("config2 - should return properties", function(){
        var config_2 = new PackageRegistryConfig();
        config_2.base = "folder1";
        
        chai.expect(config_2.base).to.eq("folder1");
    })
})