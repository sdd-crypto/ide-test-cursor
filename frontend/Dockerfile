# syntax=docker/dockerfile:1.6
FROM node:18-alpine AS build
WORKDIR /app

ARG VITE_API_BASE
ENV VITE_API_BASE=${VITE_API_BASE}

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || yarn install --frozen-lockfile || pnpm i --frozen-lockfile
COPY . .
# Ensure Vite sees VITE_ env at build time
RUN VITE_API_BASE=${VITE_API_BASE} npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]