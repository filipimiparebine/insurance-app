import { blajPreset } from "@blaj/tailwind-config"
import type { Config } from "tailwindcss"

const config: Config = {
  presets: [blajPreset],
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
}

export default config
