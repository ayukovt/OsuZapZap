import config, { BaseConfig, HapticMode } from "config";
import { PiShockDevice } from "pishock-ts";
import { NonNullableNull } from "utils";
import { BaseProvider } from "./baseProvider";

export enum PiShockMode {
    beep = "beep",
    shock = "shock",
    bibrate = "vibrate",
}

type PiShockBaseConfig = {
    username: string;
    apiKey: string;
    code: string;
}


type PiShockSubConfigShock = {
    mode: PiShockMode.shock;
    strength: number;
    duration: number;
}

type PiShockSubConfigVibrate = {
    mode: PiShockMode.bibrate;
    strength: number;
    duration: number;
}

type PiShockSubConfigBeep = {
    mode: PiShockMode.beep;
    duration: number;
}

export type PiShockConfig = BaseConfig & {
    hapticMode: HapticMode.pishock;
    piShock: PiShockBaseConfig & (PiShockSubConfigShock | PiShockSubConfigVibrate | PiShockSubConfigBeep);
}


export class PiShockProvider extends BaseProvider {
    static providerConfigMode = HapticMode.pishock;
    device: PiShockDevice = NonNullableNull();
    init() {
        console.log('Initializing PiShockProvider');
        if (config.config.hapticMode !== HapticMode.pishock) {
            throw new Error('PiShockProvider requires hapticMode to be pishock');
        }
        const requiredConfig = [
            'username',
            'apiKey',
            'code'
        ];
        switch (config.config.piShock.mode) {
            case 'beep':
                requiredConfig.push('duration');
                break;
            case 'shock':
            case 'vibrate':
                requiredConfig.push('strength');
                requiredConfig.push('duration');
                break;
            default:
                throw new Error('Invalid mode: ' + config.config.piShock.mode);
        }
        for (const key of requiredConfig) {
            // @ts-expect-error index signature
            if (!config.config.piShock[key]) {
                throw new Error(`Missing required config: piShock.${key}`);
            }
        }
        this.device = new PiShockDevice({
            username: config.config.piShock.username,
            apiKey: config.config.piShock.apiKey,
            code: config.config.piShock.code,
            name: "OsuZapZap"
        });
        if (!this.device) {
            throw new Error('Failed to initialize PiShockDevice');
        }
    }
    haptic() {
        if (config.config.hapticMode !== HapticMode.pishock) {
            throw new Error('PiShockProvider requires hapticMode to be pishock');
        }
        switch (config.config.piShock.mode) {
            case 'beep':
                this.device.beep(config.config.piShock.duration);
                break;
            case 'shock':
                this.device.shock(config.config.piShock.duration, config.config.piShock.strength);
                break;
            case 'vibrate':
                this.device.vibrate(config.config.piShock.duration, config.config.piShock.strength);
                break;
            default:
                throw new Error('Invalid PIShock mode: ' + config.config.piShock.mode);
        }
    }
}