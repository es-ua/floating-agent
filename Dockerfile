# Dockerfile for floating-agent.js static server
FROM node:20-alpine
WORKDIR /app
COPY floating-agent.js floating-agent.min.js ./
COPY agent-config.json ./
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", ".", "-l", "8080"]
