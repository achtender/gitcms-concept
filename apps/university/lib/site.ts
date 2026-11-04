import homepageJson from "@/content/site/homepage.json";
import navigationJson from "@/content/site/navigation.json";
import settingsJson from "@/content/site/settings.json";

import { homepageSchema, navigationSchema, settingsSchema } from "./schemas";

/**
 * Site data is edited through GitCMS Settings. Validating it at import time
 * means a malformed JSON file fails the build with a useful path.
 */
export const homepage = homepageSchema.parse(homepageJson);
export const navigation = navigationSchema.parse(navigationJson);
export const settings = settingsSchema.parse(settingsJson);

export const siteUrl = settings.url.replace(/\/$/, "");
