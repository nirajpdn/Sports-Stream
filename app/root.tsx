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
import { hotjar } from "react-hotjar";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Sports & Stream | Explore the sports this week",
  viewport: "width=device-width,initial-scale=1",
  description:
    "Sports streaming and schedule sports weekly. A full entertainment package.",
  keywords:
    "Sports,live streaming,free,worldcup 2022,fifa,online sports,football,football live streaming,basketball,NBA",
  "og:url": "https://sports-stream.vercel.app",
  "og:image": "https://sports-stream.vercel.app/sports-stream.png",
  "og:title": "Sports & Stream | Explore the sports this week",
  "og:description":
    "Sports streaming and schedule sports weekly. A full entertainment package.",
  "og:site_name": "Sports & Stream",
  "og:locale": "en_US",
  "og:type": "website",
  "twitter:title": "Sports & Stream | Explore the sports this week",
  "twitter:description":
    "Sports streaming and schedule sports weekly. A full entertainment package.",
  "twitter:image": "https://sports-stream.vercel.app/sports-stream.png",
  "twitter:creator": "@Nrz_pdn",
  "twitter:site": "@Nrz_pdn",
  "twitter:card": "summary_large_image",
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
      hotjar.initialize(3253884, 6);
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
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-SENEMSXE18"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-SENEMSXE18')`,
            }}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PZ7WVP4')`,
            }}
          ></script>
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PZ7WVP4"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
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
