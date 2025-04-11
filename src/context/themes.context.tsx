import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  memo,
  Fragment,
} from "react";
import { getCookie, setCookie } from "cookies-next";
import { themeKey } from "@/constants/theme.constants";

const colorSchemes = ["light", "dark"];
const MEDIA = "(prefers-color-scheme: dark)";
const isServer = typeof window === "undefined";
const ThemeContext = createContext<_IThemeContext | undefined>(undefined);
const defaultContext: _IThemeContext = { setTheme: (_) => {}, themes: [] };

export const useTheme = () => useContext(ThemeContext) ?? defaultContext;

export const ThemeProvider: React.FC<_ThemeProviderProps> = (props) => {
  const context = useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return <Fragment>{props.children}</Fragment>;
  return <Theme {...props} />;
};

const defaultThemes = ["light", "dark"];

const Theme: React.FC<_ThemeProviderProps> = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = themeKey,
  themes = defaultThemes,
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "data-theme",
  value,
  children,
  nonce,
}) => {
  const [theme, setThemeState] = useState(() =>
    getTheme(storageKey, defaultTheme)
  );
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getTheme(storageKey)
  );
  const attrs = !value ? themes : (Object.values(value) as unknown as any);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyTheme = useCallback((theme: any) => {
    let resolved = theme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (theme === "system" && enableSystem) {
      resolved = getSystemTheme();
    }

    const name = value ? value[resolved] : resolved;
    const enable = disableTransitionOnChange ? disableAnimation() : null;
    const d = document.documentElement;

    if (attribute === "class") {
      d.classList.remove(...attrs);

      if (name) d.classList.add(name);
    } else {
      if (name) {
        d.setAttribute(attribute, name);
      } else {
        d.removeAttribute(attribute);
      }
    }

    if (enableColorScheme) {
      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;
      const colorScheme = colorSchemes.includes(resolved) ? resolved : fallback;
      // @ts-ignore
      d.style.colorScheme = colorScheme;
    }

    enable?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback(
    (theme: any) => {
      console.log(theme);

      const newTheme = typeof theme === "function" ? theme(theme) : theme;
      console.log(newTheme);

      setThemeState(newTheme);
      // Save to cookies
      try {
        setCookie(storageKey, newTheme);
      } catch (error) {
        //
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forcedTheme]
  );

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, forcedTheme]
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleMediaQuery]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }
      const theme = e.newValue || defaultTheme;
      setTheme(theme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTheme]);

  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedTheme, theme]);

  const providerValue = useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === "system" ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme: (enableSystem ? resolvedTheme : undefined) as
        | "light"
        | "dark"
        | undefined,
    }),
    [theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes]
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript
        {...{
          forcedTheme,
          disableTransitionOnChange,
          enableSystem,
          enableColorScheme,
          storageKey,
          themes,
          defaultTheme,
          attribute,
          value,
          children,
          attrs,
          nonce,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeScript = memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    attrs,
    nonce,
  }: _ThemeProviderProps & { attrs: string[]; defaultTheme: string }) => {
    const defaultSystem = defaultTheme === "system";

    // Code-golfing the amount of characters in the script
    const optimization = (() => {
      if (attribute === "class") {
        const removeClasses = `c.remove(${attrs
          .map((t: string) => `'${t}'`)
          .join(",")})`;

        return `var d=document.documentElement,c=d.classList;${removeClasses};`;
      } else {
        return `var d=document.documentElement,n='${attribute}',s='setAttribute';`;
      }
    })();

    const fallbackColorScheme = (() => {
      if (!enableColorScheme) {
        return "";
      }

      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;

      if (fallback) {
        return `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${defaultTheme}'`;
      } else {
        return `if(e==='light'||e==='dark')d.style.colorScheme=e`;
      }
    })();

    const updateDOM = (
      name: string,
      literal: boolean = false,
      setColorScheme = true
    ) => {
      const resolvedName = value ? value[name] : name;
      const val = literal ? name + `|| ''` : `'${resolvedName}'`;
      let text = "";

      if (
        enableColorScheme &&
        setColorScheme &&
        !literal &&
        colorSchemes.includes(name)
      ) {
        text += `d.style.colorScheme = '${name}';`;
      }

      if (attribute === "class") {
        if (literal || resolvedName) {
          text += `c.add(${val})`;
        } else {
          text += `null`;
        }
      } else {
        if (resolvedName) {
          text += `d[s](n,${val})`;
        }
      }

      return text;
    };

    const scriptSrc = (() => {
      if (forcedTheme) {
        return `!function(){${optimization}${updateDOM(forcedTheme)}}()`;
      }

      if (enableSystem) {
        return `!function(){try{${optimization}var e=${null};if('system'===e||(!e&&${defaultSystem})){var t='${MEDIA}',m=window.matchMedia(t);if(m.media!==t||m.matches){${updateDOM(
          "dark"
        )}}else{${updateDOM("light")}}}else if(e){${
          value ? `var x=${JSON.stringify(value)};` : ""
        }${updateDOM(value ? `x[e]` : "e", true)}}${
          !defaultSystem
            ? `else{` + updateDOM(defaultTheme, false, false) + "}"
            : ""
        }${fallbackColorScheme}}catch(e){}}()`;
      }

      return `!function(){try{${optimization}var e=${null};if(e){${
        value ? `var x=${JSON.stringify(value)};` : ""
      }${updateDOM(value ? `x[e]` : "e", true)}}else{${updateDOM(
        defaultTheme,
        false,
        false
      )};}${fallbackColorScheme}}catch(t){}}();`;
    })();

    return (
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: scriptSrc }} />
    );
  },
  // Never re-render this component
  () => true
);

ThemeScript.displayName = "ThemeScript";
const getTheme = (key: string, fallback?: string) => {
  if (isServer) return undefined;
  let theme;
  try {
    console.log(getCookie(key));

    theme = getCookie(key) || undefined;
  } catch (e) {
    // Unsupported
  }
  return theme || (fallback as unknown as any);
};

const disableAnimation = () => {
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    )
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};
