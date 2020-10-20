FROM node:12.18.4 as build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn generate
RUN yarn build

FROM node:12.18.4
WORKDIR /app
COPY --from=build /app/dist /app
COPY --from=build /app/package*.json /app
COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
RUN yarn install --frozen-lockfile --production

EXPOSE 3000
CMD [ "node", "main.js" ]