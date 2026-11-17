ARG PARENT_VERSION=3.2.8-node24.22.3
ARG PORT=3000
ARG PORT_DEBUG=9229

# Development
FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}
ARG PORT
ARG PORT_DEBUG
ENV PORT ${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
CMD [ "npm", "run", "start:watch" ]

# Production
FROM defradigital/node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node:${PARENT_VERSION}

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

COPY --from=development /home/node/package*.json /home/node/
COPY --from=development /home/node/app  /home/node/app
RUN npm ci --omit=dev

USER root
RUN rm -rf /usr/local/lib/node_modules/npm /home/node/.npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx

USER node
CMD [ "node", "app" ]
