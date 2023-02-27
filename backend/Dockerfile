FROM node:16.13.0
WORKDIR /app
COPY ./package.json ./package.json
COPY  . .
RUN npm install
EXPOSE 5000
CMD ["npm","start"]