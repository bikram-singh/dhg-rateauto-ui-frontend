# — Stage 1: Build — #
FROM edgeinternaluhg.optum.com:443/glb-docker-uhg-loc/uhg-goldenimages/node:24-latest AS builder

LABEL ASK_ID="AIDE_0091809"

WORKDIR /app

COPY web/ ./
COPY webpack.config.js ./
COPY babel.config.json ./
COPY tsconfig.json ./
COPY src/ ./src/

USER root

RUN --mount=type=secret,id=npm_token \
    npm install --ignore-scripts \
    --registry https://centraluhg.jfrog.io/artifactory/api/npm/glb-npm-vir/ \
    --//centraluhg.jfrog.io/artifactory/api/npm/glb-npm-vir/:_authToken=$(cat /run/secrets/npm_token)

RUN npm run build

# — Stage 2: Serve — #
FROM edgeinternaluhg.optum.com:443/glb-docker-uhg-loc/uhg-goldenimages/nginx:1.29-latest-dev AS production

LABEL ASK_ID="AIDE_0091809"

EXPOSE 8080

COPY --from=builder /app/build /usr/share/nginx/html/feesources
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
