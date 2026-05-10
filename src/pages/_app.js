

import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Layout from "./Components/Layout";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout =
  
    Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <SessionProvider session={session}>
        <CartProvider>
          <WishlistProvider>
            {getLayout(<Component {...pageProps} />)}
          </WishlistProvider>
        </CartProvider>
      </SessionProvider>
    </>
  );
}