import { IProvider, ProvideParams } from "./interface";
import { interfaces } from "riassumere";
import { url } from "koa-router";
import axios from "axios"
import $ from "transform-ts"

const youtubeWatchPagePath = /^\/([a-zA-Z0-9_-]+)/g

export class YouTubeProvider implements IProvider {
    canProvide(url: URL): boolean {
        if (url.host === "youtu.be") {
            return true
        }
        if (url.host.endsWith("youtube.com") && url.pathname.startsWith("/watch")) {
            return true
        }
        return false
    }
    
    async provide({url}: ProvideParams): Promise<interfaces.ISummary> {
        var videoId: string | null = null
        if (url.host === "youtu.be") {
            videoId = url.pathname.slice(1)
        } else if (url.host.endsWith("youtube.com") && url.pathname.startsWith("/watch")) {
            videoId = url.searchParams.get("v")
        }

        if (videoId == null) {
            throw "WTF"
        }

        const res = await axios.get<string>(`https://www.youtube.com/get_video_info?video_id=${encodeURIComponent(videoId)}`)
        const resParams = new URLSearchParams(res.data)
        const playerResponseText = resParams.get("player_response")
        if (playerResponseText == null) throw "player_response is null"
        const playerResponse = $.obj({
            videoDetails: $.obj({
                videoId: $.string,
                title: $.string,
                shortDescription: $.string,
                thumbnail: $.obj({
                    thumbnails: $.array($.obj({
                        url: $.string,
                        width: $.number,
                        height: $.number,
                    }))
                })
            })
        }).transformOrThrow(JSON.parse(playerResponseText))
        console.log(playerResponse)

        return {
            type: "video",
            title: playerResponse.videoDetails.title,
            canonical: `https://www.youtube.com/watch?v=${playerResponse.videoDetails.videoId}`,
            description: playerResponse.videoDetails.shortDescription,
            image: playerResponse.videoDetails.thumbnail.thumbnails.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0].url,
            site_name: url.host === "music.youtube.com" ? "YouTube Music" : "YouTube",
        }
    }


}