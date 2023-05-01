# homework-isaque

## Getting Started

Substitute keys in .env file

- <https://www.prisma.io/docs/reference/database-reference/connection-urls#env>
  user "file:./db.sqlite" or substitute to your db
  DATABASE_URL="file:./db.sqlite"

- Google Api
  Obs: accessing google plataform API after credentials and generation keys after add Gmail api in your project
  GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID>
  GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>

- Your key project local
  NEXTAUTH_SECRET=<NEXTAUTH_SECRET>

Commands:

```bash

npm install

npm run postMigrateDev

npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page/index.tsx`. The page auto-updates as you edit the file.
