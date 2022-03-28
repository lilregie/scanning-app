FROM node:16

WORKDIR /usr/src/app
RUN mkdir -p ./mock-server

COPY package.json ./
COPY yarn.lock ./

COPY mock-server/package.json ./mock-server/
COPY mock-server/yarn.lock ./mock-server/

# Install dependencies for Svelte App
RUN yarn install --frozen-lockfile


WORKDIR /usr/src/app/mock-server

# Install dependencies for Mock Server
RUN yarn install --frozen-lockfile

WORKDIR /usr/src/app/

COPY . .

# Now we must swap the CSRF token
RUN sed -i 's/testing-token/demo-token/g' ./src/app.html
RUN sed -i 's/testing-token/demo-token/g' ./mock-server/src/csrf.ts

# Build Svelte App
RUN yarn build

WORKDIR /usr/src/app/mock-server

# Build Mock Server
RUN yarn build


EXPOSE 8080

CMD ["yarn", "start:prod"]