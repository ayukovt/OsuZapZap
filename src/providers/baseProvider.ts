export class BaseProvider {
    static providerConfigMode: string;
    init() {
        throw new Error('BaseProvider.init() not implemented');
    }

    haptic() {
        throw new Error('BaseProvider.haptic() not implemented');
    }
}