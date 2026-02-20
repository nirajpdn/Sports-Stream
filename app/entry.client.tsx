import { RemixBrowser } from "@remix-run/react";
import { CacheProvider } from "@emotion/react";
import {
  startTransition,
  StrictMode,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hydrateRoot } from "react-dom/client";
import { ClientStyleContext } from "./context";
import createEmotionCache from "./createEmotionCache";

const emotionCache = createEmotionCache();

function ClientCacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState(emotionCache);

  const clientStyleData = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    []
  );

  return (
    <ClientStyleContext.Provider value={clientStyleData}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <ClientCacheProvider>
          <RemixBrowser />
        </ClientCacheProvider>
      </StrictMode>
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
