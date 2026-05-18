import { base } from "@blaj/eslint-config"

export default [
  {
    ignores: [".next/**", "public/**", "next.config.ts", "postcss.config.mjs"],
  },
  ...base,
]
