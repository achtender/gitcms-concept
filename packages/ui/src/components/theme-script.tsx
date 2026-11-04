import { themeScript } from "../lib/theme-script";

/**
 * Inline theme bootstrap. Render this as the first element inside <body> so
 * the stored theme is applied before any content paints.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
