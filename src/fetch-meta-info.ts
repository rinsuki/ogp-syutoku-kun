import { interfaces } from "riassumere"
import { GeneralProvider } from "./providers/general-provider"
import { YouTubeProvider } from "./providers/youtube"

export async function fetchMetaInfo(url: URL): Promise<interfaces.ISummary> {
    const providers = [
        new YouTubeProvider(),
        new GeneralProvider(),
    ]

    for (const provider of providers) {
        if (!provider.canProvide(url)) continue
        return await provider.provide({url})
    }

    throw "not available"
}