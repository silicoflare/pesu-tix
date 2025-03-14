FROM silicoflare/bun:latest

WORKDIR /app

COPY package.json bun.lock .

COPY ./prisma/schema.prisma ./prisma/schema.prisma

RUN ls

RUN bun install --frozen-lockfile

RUN bun run postinstall

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]