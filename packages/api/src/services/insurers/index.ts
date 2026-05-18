export { BaseInsurerAdapter } from "./base";
export { getAdapter, registerAdapter, getRegisteredCodes, hasAdapter, clearAdapters } from "./factory";
export { EazyInsurerAdapter } from "./eazy";
export { AsiromInsurerAdapter } from "./asirom";
export { GeneraliInsurerAdapter } from "./generali";
export {
  GroupamaInsurerAdapter,
  OmniasigInsurerAdapter,
  AllianzInsurerAdapter,
  GraweInsurerAdapter,
  UniqaInsurerAdapter,
  CityInsurerAdapter,
} from "./adapters";
export * from "./types";

import { EazyInsurerAdapter } from "./eazy";
import { AsiromInsurerAdapter } from "./asirom";
import { GeneraliInsurerAdapter } from "./generali";
import {
  GroupamaInsurerAdapter,
  OmniasigInsurerAdapter,
  AllianzInsurerAdapter,
  GraweInsurerAdapter,
  UniqaInsurerAdapter,
  CityInsurerAdapter,
} from "./adapters";
import { registerAdapter } from "./factory";

export function registerAllAdapters(): void {
  registerAdapter("eazy", () => new EazyInsurerAdapter());
  registerAdapter("asirom", () => new AsiromInsurerAdapter());
  registerAdapter("generali", () => new GeneraliInsurerAdapter());
  registerAdapter("groupama", () => new GroupamaInsurerAdapter());
  registerAdapter("omniasig", () => new OmniasigInsurerAdapter());
  registerAdapter("allianz", () => new AllianzInsurerAdapter());
  registerAdapter("grawe", () => new GraweInsurerAdapter());
  registerAdapter("uniqa", () => new UniqaInsurerAdapter());
  registerAdapter("city", () => new CityInsurerAdapter());
}
