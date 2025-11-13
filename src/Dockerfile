FROM node:18
WORKDIR /app
COPY package*.json ./

RUN npm install -g serve json-server
RUN npm install

COPY . . .
RUN npm run build
EXPOSE 3000
EXPOSE 4000
CMD npx json-server --watch src/data/seedData.json --port 4000 & serve -s build -l 3000