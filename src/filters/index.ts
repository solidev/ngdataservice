export * from "./interface";
export * from "./dummy";
export * from "./basic";

import {DSDummyFilter, DSDummyFilterProvider} from "./dummy";
import {DSBasicFilter, DSBasicFilterProvider} from "./basic";

export const DS_FILTERS = [DSDummyFilter, DSBasicFilter];
export const DS_FILTER_PROVIDERS = [DSDummyFilterProvider, DSBasicFilterProvider];