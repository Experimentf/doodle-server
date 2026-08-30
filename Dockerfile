FROM node:23-alpine AS build

WORKDIR /app

# Install all dependencies (including devDependencies, needed to compile TypeScript)
COPY package*.json ./
RUN npm install

# Compile TypeScript to JavaScript once, at image build time
COPY . .
RUN npm run build

FROM node:23-alpine AS production

WORKDIR /app

# Install only production dependencies (smaller, faster, no TypeScript toolchain)
COPY package*.json ./
RUN npm install --omit=dev

# Bring in just the compiled output from the build stage
COPY --from=build /app/dist ./dist

# Expose port for backend
EXPOSE 5000

CMD [ "node", "-r", "module-alias/register", "dist/app.js" ]