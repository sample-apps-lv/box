FROM node:22-alpine as builder
WORKDIR /app/ui
COPY . .
RUN npm install --force
RUN npm run build

ENV VITE_PORT=8008

CMD ["npm", "run", "preview"]
