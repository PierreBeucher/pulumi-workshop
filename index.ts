import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const staticIP = new gcp.compute.Address("staticIP", {
    name: "mystaticip",
});

const debianImage = gcp.compute.getImage({
    family: "debian-11",
    project: "debian-cloud",
});

const computeInstance = new gcp.compute.Instance("myinstance", {
    machineType: "e2-micro",
    bootDisk: {
        initializeParams: {
            image: debianImage.then(i => i.selfLink)
        },
    },
    networkInterfaces: [{
        network: "default",
        accessConfigs: [{ 
            natIp: staticIP.address
        }],
    }],
    metadata: {
        "ssh-keys": "pierre:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFCaDcbK5+r0s0cbl9RC1kKDr0p3vJfErE6RIOwNeXEP pbeucher@nixos"
    }
});


export const instanceName = computeInstance.name
export const instanceIP = staticIP.address