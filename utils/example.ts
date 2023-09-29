import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

import { StaticIPInstance } from "./componentResource"

export function example(){

    const config = new pulumi.Config()

    const keys = config.requireObject<string[]>("ssh-keys");

    const computeInstance = new StaticIPInstance("my-instance", {
        sshKeys: keys,
        image: "debian-11-bullseye-v20230912",
        type: "e2-micro"
    })

    const address = computeInstance.address.address

    const instance = gcp.compute.getInstance({name: "instance-37a7327"})

    instance.then(i => pulumi.log.info(`Instance data: ${JSON.stringify(i, null, 2)}`))
}