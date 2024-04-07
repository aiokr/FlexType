## Get Start

使用 TriCMS 之前，首先需要配置环境变量

```
# Connect Database
# 供 Prisma 链接数据库使用
# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL=
# Direct connection to the database. Used for migrations.
DIRECT_URL=

# Connect Supbase 
# 链接 Subpase 使用
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Auth.js
AUTH_SECRET=

# Github OAuth app
# Get in https://github.com/settings/developers
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Authorized Email, only authorized Email can be used as administrator accounts
# 被授权邮箱，仅被授权的邮箱可以作为管理员账户
AUTHORIZED_EMAILS="xxx@xxx.com,xx2@xxx.com"
```