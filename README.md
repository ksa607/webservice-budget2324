# webservices-budget

This is the backend used in lessons Web Services.

## Requirements

- [NodeJS v17 or higher](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [MySQL v8](https://dev.mysql.com/downloads/windows/installer/8.0.html) (no Oracle account needed, click the tiny link below the grey box)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (no Oracle account needed, click the tiny link below the grey box)

For users of [Chocolatey](https://chocolatey.org/):

```powershell
choco install nodejs -y
choco install yarn -y
choco install mysql -y
choco install mysql.workbench -y
```

## Before starting/testing this project

Create a `.env`file with the following template. Complete the environment variables with your secrets, credentials, etc. Note: `false` is defined as an
empty variable (e.g. `LOG_DISABLED`).

```bash
# General configuration
NODE_ENV=development

# Database configuration
DATABASE_URL=mysql://root:root@localhost:3306/budget
```

## Start this project

### Development

- Make sure Corepack is enabled: `corepack enable`
- Install all dependencies: `yarn`
- Make sure a `.env` exists (see above)
- Migrate the database: `yarn prisma migrate dev`
- Seed the database: `yarn prisma db seed`
- Start the development server: `yarn start:dev`
