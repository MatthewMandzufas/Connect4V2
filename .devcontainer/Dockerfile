FROM node:20.15-alpine as builder
RUN npm install -g pnpm 
USER node
WORKDIR /app
COPY --chown=node:node src/* src/
COPY --chown=node:node package.json .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node pnpm-lock.yaml .
RUN pnpm i 
RUN pnpm run build 


FROM node:20.15-alpine
RUN apk add dumb-init
USER node
WORKDIR /app
ENV NODE_END production
COPY --chown=node:node --from=builder /app/dist/index.js .
# RUN node index.js
CMD ["dumb-init", "node", "/app/index.js"]

