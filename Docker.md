# Docker

## Usage

Invoke as follows to export all Measure and MeasureReport resources to the downloads directory

    docker run \
        --volume $PWD:/opt/node/app/downloads \
    ghcr.io/uwcirg/bulk-data-client:main \
        --global \
        --fhir-url http://hapi.fhir.org/baseR4/ \
        --_type Measure,MeasureReport
