FROM node:15.5.0-alpine3.12
WORKDIR /app
ADD . /app
RUN npm install
CMD ["node", "main.js"]
