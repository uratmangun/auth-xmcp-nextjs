import {Environment, ParaWeb} from "@getpara/react-sdk";

const PARA_API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY!;

if (!PARA_API_KEY) {
  console.warn("NEXT_PUBLIC_PARA_API_KEY is not set. Para features will not work.");
}

export const para = new ParaWeb(Environment.BETA, PARA_API_KEY, {
  disableAutoSessionKeepAlive: false,
});
