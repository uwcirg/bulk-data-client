import BulkDataClient              from "../lib/BulkDataClient"
import { BulkDataClient as Types } from "../.."
import { formatDuration, humanFileSize } from "../lib/utils";


export default function TextReporter(client: BulkDataClient)
{
    let downloadedPct = 0;
    let downloadStart = 0;

    function onKickOffStart() {
        console.log("Kick-off started")
    }

    function onKickOffEnd() {
        console.log("Kick-off completed")
    }

    function onAuthorize() {
        console.log("Got new access token")
    }

    function onExportStart(status: Types.ExportStatus) {
        downloadedPct = 0;
        console.log(status.message)
    }

    function onExportProgress(status: Types.ExportStatus) {
        console.log(status.message)
    }

    function onExportComplete(manifest: Types.ExportManifest) {
        console.log("Received export manifest")
    }

    function onDownloadStart(downloads: Types.FileDownload[]) {
        if (!downloadStart) {
            console.log("Begin file downloads...")
            downloadStart = Date.now()
        }
    }

    function onDownloadProgress(downloads: Types.FileDownload[]) {
        const done = downloads.filter(d => d.completed)
        const pct = Math.round(done.length / downloads.length * 100);
        if (downloadedPct != pct) {
            downloadedPct = pct
            
            // Only show up to 20 progress messages
            if (pct % 5 === 0) {
                const size1: number = done.reduce((prev: number, cur) => prev + cur.downloadedBytes  , 0);
                const size2: number = done.reduce((prev: number, cur) => prev + cur.uncompressedBytes, 0);
                
                let line = `${pct}%`.padStart(4) + " - " +
                    `${done.length}`.padStart(String(downloads.length).length) +
                    ` out of ${downloads.length} files downloaded - ` +
                    `${humanFileSize(size1)} total`;

                if (size2 != size1) {
                    line += ` (${humanFileSize(size2)} uncompressed)`
                }

                console.log(line)
            }
        }
    }

    function onDownloadComplete(downloads: Types.FileDownload[]) {
        console.log(`Download completed in ${formatDuration(Date.now() - downloadStart)}`)
    }

    function onError(error: Error) {
        console.error(error)
    }

    client.on("authorize"       , onAuthorize       )
    client.on("kickOffStart"    , onKickOffStart    )
    client.on("kickOffEnd"      , onKickOffEnd      )
    client.on("exportStart"     , onExportStart     )
    client.on("exportProgress"  , onExportProgress  )
    client.on("exportComplete"  , onExportComplete  )
    client.on("downloadStart"   , onDownloadStart   )
    client.on("downloadProgress", onDownloadProgress)
    client.on("downloadComplete", onDownloadComplete)
    client.on("error"           , onError           )

    return {
        detach() {
            client.off("authorize"       , onAuthorize       )
            client.off("kickOffStart"    , onKickOffStart    )
            client.off("kickOffEnd"      , onKickOffEnd      )
            client.off("exportStart"     , onExportStart     )
            client.off("exportProgress"  , onExportProgress  )
            client.off("exportComplete"  , onExportComplete  )
            client.off("downloadStart"   , onDownloadStart   )
            client.off("downloadProgress", onDownloadProgress)
            client.off("downloadComplete", onDownloadComplete)
            client.off("error"           , onError           )
        }
    }
}