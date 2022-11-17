// root.tsx
import React, { useContext, useEffect } from "react";
import { Global, withEmotionCache } from "@emotion/react";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { MetaFunction, LinksFunction } from "@remix-run/node"; // Depends on the runtime you choose

import { ServerStyleContext, ClientStyleContext } from "./context";
import { theme } from "~/theme";
import { GlobalStyles } from "~/styles";
import Layout from "~/components/Layout";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Sports & Stream | Explore the sports this week",
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      href: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600&display=swap",
      rel: "stylesheet",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap",
      rel: "stylesheet",
    },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Global styles={GlobalStyles} />
        <Layout>
          <Outlet />
        </Layout>
      </ChakraProvider>
    </Document>
  );
}
