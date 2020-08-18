import { NowRequest, NowResponse } from "@vercel/node"
import $ from "transform-ts"
import { fetchMetaInfo } from "../../src/fetch-meta-info"

export default async function (req: NowRequest, res: NowResponse) {
    res.setHeader("access-control-allow-origin", "*")
    const { url } = $.obj({url: $.string}).transformOrThrow(req.query)
    const urlObj = new URL(url)
    if (!["http:", "https:"].includes(urlObj.protocol)) {
        res.status(400).send("Unknown Protocol")
        return
    }

    const info = await fetchMetaInfo(urlObj)
    res.setHeader("Cache-Control", "max-age=86400, public")
    res.send(info)
}