import { IProvider, ProvideParams } from "./interface";
import client from "cheerio-httpcli"
import { DEFAULT_USER_AGENT } from "../const";
import { interfaces } from "riassumere";
client.set('headers', {
    "User-Agent": DEFAULT_USER_AGENT
})
client.set("referer", false)
client.set("timeout", 5000)
client.set("maxDataSize", 5 * 1024 * 1024)

export class GeneralProvider implements IProvider {
    canProvide(url: URL) {
        return true
    }

    async provide({url}: ProvideParams): Promise<interfaces.ISummary> {
        const res = await client.fetch(url.href)
        if (res.error) throw res.error
        if (!res.response.headers["content-type"]?.startsWith("text/html")) throw "not html"
        return {
            type: "website",
            title: res.$('meta[property="og:title"]').attr("content") || res.$("title").text(),
            description: res.$('meta[property="og:description"]').attr("content") || res.$('meta[name="description"]').attr("content"),
            canonical: res.$('link[canonical]').attr("href") || url.href,
        }
    }
}