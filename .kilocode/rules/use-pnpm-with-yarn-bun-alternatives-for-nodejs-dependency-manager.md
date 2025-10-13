---
description: Enforce pnpm as the primary package manager with yarn and bun as allowed alternatives; never use npm
alwaysApply: true
---

# Node.js Package Manager Standards

## Required Package Managers

**MANDATORY**: Use `pnpm` as the primary package manager, with `yarn` or `bun` as alternatives when pnpm doesn't exist or encounters errors. Never use `npm`.

### Preferred Order

1. **pnpm** - Efficient disk usage, strict dependency resolution, fast performance
2. **yarn** - Alternative option when pnpm is unavailable or fails
3. **bun** - Fast alternative package manager with built-in runtime

### Installation Commands

```bash
# Using pnpm (preferred)
pnpm install
pnpm add <package>
pnpm remove <package>
pnpm run <script>

# Using yarn (alternative)
yarn install
yarn add <package>
yarn remove <package>
yarn run <script>

# Using bun (alternative)
bun install
bun add <package>
bun remove <package>
bun run <script>
```

### Project Detection

- If `pnpm-lock.yaml` exists, use `pnpm`
- If `yarn.lock` exists and pnpm is unavailable, use `yarn`
- If `bun.lockb` exists and pnpm/yarn are unavailable, use `bun`
- Always try `pnpm` first, then fallback to `yarn` or `bun` based on project lockfiles
- Never generate `package-lock.json`

### Script Execution

Always use the detected package manager for running scripts:

- `pnpm dev` (preferred)
- `yarn dev` (alternative)
- `bun dev` (alternative)

This ensures consistent dependency resolution with pnpm's superior performance and disk efficiency, while allowing yarn and bun as reliable alternative options when needed.
