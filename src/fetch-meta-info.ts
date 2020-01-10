import { interfaces } from "riassumere"

export async function fetchMetaInfo(url: URL): Promise<interfaces.ISummary> {
    return {
        title: "test",
        canonical: "fuck",
        type: "object",
        description: "it's only test",
    }
}