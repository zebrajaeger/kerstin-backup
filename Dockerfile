FROM node:20-alpine

# Arbeitsverzeichnis
WORKDIR /app

# Abhängigkeiten
COPY package*.json ./
RUN npm install && npm audit fix

# Projektdateien
COPY . .

# Exponiere Port
EXPOSE 3000

# Startbefehl
CMD ["npm", "start"]
