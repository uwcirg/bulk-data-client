FROM node:15

# cache hack (very fragile): initially only copy list of project dependencies
COPY --chown=node:node package.json package-lock.json /opt/node/

# allow hot-reloading: install node dependencies to parent directory of code
WORKDIR /opt/node
USER node
RUN npm install

ENV SHOW_ERRORS=true

# copy source code, switch to code directory
COPY --chown=node:node . /opt/node/app
WORKDIR /opt/node/app

ENTRYPOINT [ \
    "node", \
        "--trace-exit", \
        "--trace-warnings", \
    ".", \
    "--reporter=text" \
]
