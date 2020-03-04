import * as fs from "fs";
import * as path from "path";

import { Log, WebFaasError } from "@webfaas/webfaas-core";
import { IPackageRegistry, IPackageRegistryResponse } from "@webfaas/webfaas-core";
import { PackageStoreUtil } from "@webfaas/webfaas-core";
import { ModuleNameUtil } from "@webfaas/webfaas-core";

import { PackageRegistryConfig } from "./PackageRegistryConfig";

export class PackageRegistry implements IPackageRegistry {
    private config: PackageRegistryConfig;
    private log: Log;

    constructor(config?: PackageRegistryConfig, log?: Log){
        this.config = config || new PackageRegistryConfig();
        
        this.log = log || new Log();
    }

    getTypeName(): string{
        return "disk";
    }

    /**
     * return config
     */
    getConfig(): PackageRegistryConfig{
        return this.config;
    }

    /**
     * return file name
     * @param name module name
     * @param version module version
     */
    getFileName(name: string, version?: string): string{
        var moduleNameData = ModuleNameUtil.parse(name, "");
        
        if (version){
            if (moduleNameData.scopeName !== "default"){
                return path.join(this.config.base, moduleNameData.scopeName + "-" + moduleNameData.moduleNameWhitOutScopeName) + "-" + version + ".tgz";
            }
            else{
                return path.join(this.config.base, moduleNameData.moduleName) + "-" + version + ".tgz";
            }
        }
        else{
            if (moduleNameData.scopeName !== "default"){
                return path.join(this.config.base, moduleNameData.scopeName + "-" + moduleNameData.moduleNameWhitOutScopeName + ".json");
            }
            else{
                return path.join(this.config.base, moduleNameData.moduleName + ".json");
            }
        }
    }

    /**
     * return manifest in IPackageRegistryResponse
     * @param name manifest name
     * @param etag manifest etag
     */
    getManifest(name: string, etag?: string): Promise<IPackageRegistryResponse>{
        return new Promise(async (resolve, reject) => {
            try {
                var fileEtag = "";
                var filePath = this.getFileName(name, "");
                
                var packageResponseObj = {} as IPackageRegistryResponse;

                fs.stat(filePath, function(err, stats){
                    if (err){
                        if (err.code === "ENOENT") {
                            packageResponseObj.packageStore = null;
                            packageResponseObj.etag = "";
                            resolve(packageResponseObj);
                        }
                        else{
                            reject(new WebFaasError.FileError(err));
                        }
                    }
                    else{
                        fileEtag = stats.mtime.toISOString();

                        if (fileEtag === etag){
                            packageResponseObj.packageStore = null;
                            packageResponseObj.etag = etag;
                            resolve(packageResponseObj);
                        }
                        else{
                            fs.readFile(filePath, function(err, fileBuffer){
                                if (err){
                                    reject(new WebFaasError.FileError(err));
                                }
                                else{
                                    packageResponseObj.packageStore = PackageStoreUtil.buildPackageStoreFromListBuffer(name, "", fileEtag, [fileBuffer], ["package.json"]);

                                    resolve(packageResponseObj);
                                }
                            });
                        }
                    }
                })
            }
            catch (errTry) {
                reject(errTry);
            }
        });
    }

    /**
     * return package in IPackageRegistryResponse
     * @param name package name
     * @param version package version
     * @param etag package etag
     */
    getPackage(name: string, version: string, etag?: string): Promise<IPackageRegistryResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                var fileEtag = "";
                var filePath = this.getFileName(name, version);
                var packageResponseObj = {} as IPackageRegistryResponse;
                
                fs.stat(filePath, function(err, stats){
                    if (err){
                        if (err.code === "ENOENT") {
                            packageResponseObj.packageStore = null;
                            packageResponseObj.etag = "";
                            resolve(packageResponseObj);
                        }
                        else{
                            reject(new WebFaasError.FileError(err));
                        }
                    }
                    else{
                        fileEtag = stats.mtime.toISOString();

                        if (fileEtag === etag){
                            packageResponseObj.packageStore = null;
                            packageResponseObj.etag = etag;
                            resolve(packageResponseObj);
                        }
                        else{
                            fs.readFile(filePath, function(err, fileBufferCompressed){
                                if (err){
                                    reject(new WebFaasError.FileError(err));
                                }
                                else{
                                    packageResponseObj.packageStore = PackageStoreUtil.buildPackageStoreFromTarGzBuffer(name, version, fileEtag, fileBufferCompressed);
                
                                    resolve(packageResponseObj);
                                }
                            });
                        }
                    }
                })
            }
            catch (errTry) {
                reject(errTry);
            }
        });
    }

    start(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        })
    }

    stop(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        })
    }
}