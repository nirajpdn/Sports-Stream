import { css } from "@emotion/react";

export const GlobalStyles = css`
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    font-size: 100%;
  }
  body {
    font-family: "Source Sans Pro", sans-serif;
  }
  img {
    display: block;
  }
  .caveat {
    font-family: "Caveat", sans-serif;
  }
`;
