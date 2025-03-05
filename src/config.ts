import { existsSync, readFileSync } from "fs";
import { IntifaceConfig } from "providers/intiface";
import { PiShockConfig } from "providers/pishock";

export enum Mode {
    onHit = "onHit",
    onMiss = "onMiss",
}
export enum HapticMode {
    pishock = "pishock",
    intiface = "intiface",
}


export type BaseConfig = {
    "$schema": "./configschema.json" // This is a JSON schema URL
    cooldown: number;
    mode: Mode;
}




export type Config = PiShockConfig | IntifaceConfig;

function findConfigPath(): string {
    const search = [
        "./config.json",
        "../config.json",
    ]

    for (const relPath of search) {
        if (existsSync(relPath)) {
            return relPath;
        }
    }
    throw new Error('Could not find config.json');
}

class clConfig {
    public config: Config;
    constructor() {
        const configPath = findConfigPath();
        const configContents = readFileSync(configPath, 'utf8');
        this.config = JSON.parse(configContents);
    }
}

const config = new clConfig();
export default config;