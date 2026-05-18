import { base } from "@blaj/eslint-config"

export default [
  { ignores: ["dist/**", "node_modules/**", ".turbo/**"] },
  ...base,
]
