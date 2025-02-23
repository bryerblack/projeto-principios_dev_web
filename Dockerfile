# Etapa 1: Construção da aplicação
FROM node:18 AS builder
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

# Compila o TypeScript
RUN npm run build

# Etapa 2: Executar a aplicação
FROM node:18
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --only=production

# Copia a pasta compilada
COPY --from=builder /app/dist /app/dist

# 🔹 Garante que o swagger.json seja copiado para o contêiner
COPY swagger.json /app/swagger.json

EXPOSE 3000

CMD ["node", "dist/index.js"]
