# 🗄️ Drizzle ORM Setup

## ✅ Migration Complete!

Your database has been successfully migrated using **Drizzle ORM** with PostgreSQL (Neon).

## 📊 What Was Done

### 1. Installed Drizzle ORM
```bash
✓ drizzle-orm@0.44.7
✓ drizzle-kit@0.31.5
✓ postgres@3.4.7
```

### 2. Created Drizzle Schema
**File:** `src/db/schema.ts`

Converted SQL schema to Drizzle TypeScript schema with 7 tables:
- ✅ `user` - User accounts
- ✅ `session` - User sessions
- ✅ `account` - OAuth accounts
- ✅ `verification` - Email verification
- ✅ `oauthApplication` - OAuth clients
- ✅ `oauthAccessToken` - Access tokens
- ✅ `oauthConsent` - User consent

### 3. Created Database Connection
**File:** `src/db/index.ts`

Configured Drizzle with postgres.js driver for Neon database.

### 4. Generated & Applied Migration
**File:** `drizzle/0000_thankful_frog_thor.sql`

Migration successfully applied to your Neon database:
```
✓ migrations applied successfully!
```

### 5. Updated Better Auth
**File:** `src/lib/auth.ts`

Replaced `pg.Pool` with Drizzle adapter:
```typescript
database: drizzleAdapter(db, {
  provider: "pg",
  schema,
})
```

### 6. Added NPM Scripts
**File:** `package.json`

New database management commands:
- `bun run db:generate` - Generate migrations
- `bun run db:migrate` - Apply migrations
- `bun run db:push` - Push schema changes
- `bun run db:studio` - Open Drizzle Studio

## 📁 Project Structure

```
src/
├── db/
│   ├── schema.ts          # Drizzle schema definitions
│   └── index.ts           # Database connection
├── lib/
│   └── auth.ts            # Better Auth with Drizzle adapter
drizzle/
└── 0000_*.sql             # Migration files
drizzle.config.ts          # Drizzle configuration
```

## 🚀 Usage

### Query the Database

```typescript
import { db } from "@/db";
import { user, session } from "@/db/schema";
import { eq } from "drizzle-orm";

// Select all users
const users = await db.select().from(user);

// Find user by email
const foundUser = await db
  .select()
  .from(user)
  .where(eq(user.email, "user@example.com"));

// Insert a new user
const newUser = await db
  .insert(user)
  .values({
    id: "user_123",
    name: "John Doe",
    email: "john@example.com",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  .returning();

// Update user
await db
  .update(user)
  .set({ name: "Jane Doe" })
  .where(eq(user.id, "user_123"));

// Delete user
await db
  .delete(user)
  .where(eq(user.id, "user_123"));
```

### Joins and Relations

```typescript
import { db } from "@/db";
import { user, session } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get user with sessions
const userWithSessions = await db
  .select()
  .from(user)
  .leftJoin(session, eq(user.id, session.userId))
  .where(eq(user.email, "user@example.com"));
```

### Transactions

```typescript
import { db } from "@/db";
import { user, account } from "@/db/schema";

await db.transaction(async (tx) => {
  // Create user
  const [newUser] = await tx
    .insert(user)
    .values({
      id: "user_123",
      name: "John Doe",
      email: "john@example.com",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // Create account
  await tx.insert(account).values({
    id: "account_123",
    accountId: "google_123",
    providerId: "google",
    userId: newUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});
```

## 🛠️ Database Commands

### Generate Migration
When you modify `src/db/schema.ts`:
```bash
bun run db:generate
```

### Apply Migration
Apply pending migrations to database:
```bash
bun run db:migrate
```

### Push Schema (Development)
Push schema changes directly (no migration files):
```bash
bun run db:push
```

### Drizzle Studio
Visual database browser:
```bash
bun run db:studio
```
Opens at `https://local.drizzle.studio`

## 🔄 Making Schema Changes

### 1. Update Schema
Edit `src/db/schema.ts`:

```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  // Add new field
  phoneNumber: text("phoneNumber"),
  // ...
});
```

### 2. Generate Migration
```bash
bun run db:generate
```

### 3. Review Migration
Check `drizzle/XXXX_*.sql` file

### 4. Apply Migration
```bash
bun run db:migrate
```

## 📝 Schema Reference

### User Table
```typescript
{
  id: text,
  name: text,
  email: text (unique),
  emailVerified: boolean,
  image: text?,
  createdAt: timestamp,
  updatedAt: timestamp,
  paraWalletId: text?,
  paraEmail: text?
}
```

### Session Table
```typescript
{
  id: text,
  expiresAt: timestamp,
  token: text (unique),
  createdAt: timestamp,
  updatedAt: timestamp,
  ipAddress: text?,
  userAgent: text?,
  userId: text (FK → user.id)
}
```

### Account Table
```typescript
{
  id: text,
  accountId: text,
  providerId: text,
  userId: text (FK → user.id),
  accessToken: text?,
  refreshToken: text?,
  idToken: text?,
  accessTokenExpiresAt: timestamp?,
  refreshTokenExpiresAt: timestamp?,
  scope: text?,
  password: text?,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔍 Drizzle Studio

Visual database browser with:
- ✅ Browse all tables
- ✅ View data
- ✅ Edit records
- ✅ Run queries
- ✅ View relationships

```bash
bun run db:studio
```

## 🎯 Benefits of Drizzle ORM

### Type Safety
```typescript
// ✅ TypeScript knows the schema
const users = await db.select().from(user);
// users is typed as User[]

// ❌ TypeScript catches errors
await db.select().from(user).where(eq(user.invalidField, "value"));
//                                      ^^^^^^^^^^^^ Error!
```

### SQL-like Syntax
```typescript
// Drizzle (SQL-like)
await db
  .select()
  .from(user)
  .where(eq(user.email, "user@example.com"));

// vs Raw SQL
await db.query("SELECT * FROM user WHERE email = $1", ["user@example.com"]);
```

### Performance
- ✅ Zero runtime overhead
- ✅ Prepared statements
- ✅ Connection pooling
- ✅ Optimized queries

### Developer Experience
- ✅ Auto-completion
- ✅ Type inference
- ✅ Migration generation
- ✅ Visual studio

## 🔒 Security

### Prepared Statements
Drizzle uses prepared statements by default:
```typescript
// ✅ Safe from SQL injection
await db
  .select()
  .from(user)
  .where(eq(user.email, userInput));
```

### Type Validation
```typescript
// ✅ TypeScript validates types
await db.insert(user).values({
  id: "user_123",
  email: 123, // ❌ Error: Type 'number' is not assignable to type 'string'
});
```

## 📚 Resources

- **Drizzle Docs:** https://orm.drizzle.team/docs/overview
- **Drizzle with PostgreSQL:** https://orm.drizzle.team/docs/get-started-postgresql
- **Drizzle Queries:** https://orm.drizzle.team/docs/rqb
- **Better Auth + Drizzle:** https://www.better-auth.com/docs/adapters/drizzle

## 🐛 Troubleshooting

### Connection Issues
```bash
# Test connection
bun run db:studio
```

### Migration Issues
```bash
# Reset migrations (development only!)
# 1. Drop all tables in database
# 2. Delete drizzle/ folder
# 3. Regenerate
bun run db:generate
bun run db:migrate
```

### Type Issues
```bash
# Regenerate types
bun run db:generate
```

## ✨ Summary

✅ **Drizzle ORM installed and configured**  
✅ **Schema migrated to Neon PostgreSQL**  
✅ **Better Auth using Drizzle adapter**  
✅ **Type-safe database queries**  
✅ **Migration system ready**  
✅ **Drizzle Studio available**

Your database is now fully managed with Drizzle ORM!

---

**Status:** ✅ Complete  
**Database:** Neon PostgreSQL  
**ORM:** Drizzle v0.44.7  
**Tables:** 7 migrated successfully
