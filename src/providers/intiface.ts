import { ButtplugClient, ButtplugNodeWebsocketClientConnector } from "buttplug";
import config, { BaseConfig, HapticMode } from "config";
import { NonNullableNull } from "utils";
import { BaseProvider } from "./baseProvider";

export type IntifaceConfig = BaseConfig & {
    hapticMode: HapticMode.intiface;
    intiface: {
        host: string;
        port: number;
        vibrateStrength: number;
    }
}

export class IntifaceProvider extends BaseProvider {
    static providerConfigMode = HapticMode.intiface;
    client: ButtplugClient = NonNullableNull();
    connector: ButtplugNodeWebsocketClientConnector = NonNullableNull();
    init() {
        console.log('Initializing IntifaceProvider');
        if (config.config.hapticMode !== HapticMode.intiface) {
            throw new Error('intiface requires hapticMode to be intiface');
        }
        const requiredConfig = ['port'];
        for (const key of requiredConfig) {
            // @ts-expect-error index signature
            if (!config.config.intiface[key]) {
                throw new Error(`Missing required config: intiface.${key}`);
            }
        }
        
        
        this.reconnect();
    }
    private reconnect() {
        if (config.config.hapticMode !== HapticMode.intiface) {
            throw new Error('intiface requires hapticMode to be intiface');
        }
        this.client = new ButtplugClient("OsuZapZap");
        this.connector = new ButtplugNodeWebsocketClientConnector(`ws://${config.config.intiface.host}:${config.config.intiface.port}/buttplug`);
        this.client.on("disconnect", this.reconnect);
        this.client.on("connect", () => {
            console.log('Connected to Intiface');
        });
        this.client.on("deviceadded", (device) => {
            console.log('Device added:', device.Name);
        });
        this.client.connect(this.connector);
    }
    haptic() {
        if (this.client.devices.length === 0) {
            console.error('No devices connected');
            return;
        }
        this.client.devices.forEach((device) => {
            device.vibrate(0.5);
        });
    }
}