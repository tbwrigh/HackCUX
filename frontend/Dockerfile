FROM node:21

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx tailwindcss -o ./src/App.css

EXPOSE 5173

CMD ["npm", "run", "dev"]