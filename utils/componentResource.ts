import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

interface StaticIPInstanceArgs {

    /**
     * Instance type, e.g. e2-micro
     */
    type: string,

    /**
     * Instance image, e.g. debian-11-bullseye-v20230912 
     */
    image: string,

    /**
     * Public SSH keys to connect on instance. 
     * Format 'USER:KEY' e.g. 'username:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILg6UtHDNyMNAh0GjaytsJdrUxjtLy3APXqZfNZhvCeT dev'
     * See https://cloud.google.com/compute/docs/connect/add-ssh-keys#terraform_1
     * 
     * Note: we would have stronger typing such as `sshKeys: { user: string, key: string }[]`
     */
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
        }, {
            parent: this
        });
        
        new gcp.compute.Instance("instance", {
            machineType: args.type,
            bootDisk: {
                initializeParams: {
                    image: args.image
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
        }, {
            parent: this
        });
        
    }
}

