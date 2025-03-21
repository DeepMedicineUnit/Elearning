FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install --production

RUN npm run build

CMD ["npm", "start"]
