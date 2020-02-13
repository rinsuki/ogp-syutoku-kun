import Koa from "koa"
import Router from "koa-router"
import $ from "transform-ts"
import { fetchMetaInfo } from "./fetch-meta-info"

const app = new Koa()
const router = new Router()

router.use(async (ctx, next) => {
    ctx.set("access-control-allow-origin", "*")
    await next()
})

router.get("/", async ctx => {
    ctx.body = `<meta charset="UTF-8">→→→ <a href="https://github.com/rinsuki/ogp-syutoku-kun">https://github.com/rinsuki/ogp-syutoku-kun</a> ←←←`
})

router.get("/api/v1/fetch", async ctx => {
    const { url } = $.obj({
        url: $.string,
    }).transformOrThrow(ctx.query)
    const urlObj = new URL(url)
    if (!["http:", "https:"].includes(urlObj.protocol)) ctx.throw(400, "Unknown Protocol")

    ctx.body = await fetchMetaInfo(urlObj)
    ctx.set('Cache-Control', 'public; max-age=86400')
})

app.use(router.routes())
app.listen(process.env.PORT || 3000)
