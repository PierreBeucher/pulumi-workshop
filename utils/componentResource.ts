import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

interface StaticIPInstanceArgs {
    type: string,
    sshKeys: string[]
}

/**
 * Example component resource for a compute instance with static IP
 * Use with:
 *
 * ``` 
 * import { StaticIPInstance } from "./utils/componentResource"
 * 
 * const computeInstance = new StaticIPInstance("my-instance", {
 *   sshKeys: [ "pierre:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFCaDcbK5+r0s0cbl9RC1kKDr0p3vJfErE6RIOwNeXEP pbeucher@nixos" ],
 *    type: "e2-micro"
 * })
 *
 * export const address = computeInstance.address.address
 * ```
 * 
 */
export class StaticIPInstance extends pulumi.ComponentResource {

    public readonly address : gcp.compute.Address

    constructor(name: string, args: StaticIPInstanceArgs, opts?: pulumi.ComponentResourceOptions) {
        super("crafteo:pulumi-workshop", name, args, opts);

        this.address = new gcp.compute.Address("staticIP", {
            name: `${name}-ip`,
        });
        
        const debianImage = gcp.compute.getImage({
            family: "debian-11",
            project: "debian-cloud",
        });
        
        new gcp.compute.Instance("instance", {
            machineType: args.type,
            bootDisk: {
                initializeParams: {
                    image: debianImage.then(i => i.selfLink)
                },
            },
            networkInterfaces: [{
                network: "default",
                accessConfigs: [{ 
                    natIp: this.address.address
                }],
            }],
            metadata: {
                "name": name,
                "ssh-keys": args.sshKeys.join("\n")
            }
        });
        
    }
}

