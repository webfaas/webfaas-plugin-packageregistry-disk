import * as chai from "chai";

import { Core, LogLevelEnum } from "@webfaas/webfaas-core";

import WebFassPlugin from "../lib/WebFassPlugin";
import { Config } from "@webfaas/webfaas-core/lib/Config/Config";

describe("Plugin", () => {
    it("start and stop - new", async function(){
        let core = new Core();
        let plugin = new WebFassPlugin(core);
        chai.expect(typeof(plugin)).to.eq("object");
        core.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        await plugin.startPlugin(core);
        await plugin.stopPlugin(core);
        await plugin.stopPlugin(core); //retry stop

        //config
        let configData = {
            "registry":{
                "disk": [
                    {
                        "name": "disk2",
                        "base": "/tmp/disk2"
                    }
                ]
            }
        }
        let core2 = new Core( new Config(configData) );
        let plugin2 = new WebFassPlugin(core2);
        core2.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        chai.expect(core2.getPackageRegistryManager().getRegistryItem("disk2")).to.not.null;
        chai.expect(core2.getPackageRegistryManager().getRegistryItem("disk2")?.name).to.eq("disk2");
    })
})