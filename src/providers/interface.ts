import { interfaces } from "riassumere";

export interface ProvideParams {
    url: URL
}

export interface IProvider {
    canProvide(url: URL): boolean
    provide(params: ProvideParams): Promise<interfaces.ISummary>
}