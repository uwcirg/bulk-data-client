
export class FileDownloadError extends Error
{
    readonly code: number;
    readonly body: string | object | null;
    readonly fileUrl: string

    constructor({
        body,
        code,
        fileUrl
    }: {
        body: string | fhir4.OperationOutcome | null, // Buffer
        code: number,
        fileUrl: string
    }) {
        super(`Downloading the file from ${fileUrl
            } returned HTTP status code ${code}.${
            body ? " Body: " + JSON.stringify(body) : ""
        }`)

        this.code = code
        this.body = body
        this.fileUrl = fileUrl

        Error.captureStackTrace(this, this.constructor)
    }
}
