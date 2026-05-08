// import "@/styles/globals.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { SessionProvider } from "next-auth/react";
// import Head from "next/head";

// export default function App({
//   Component,
//   pageProps: { session, ...pageProps },
// }) {
//   return (
//     <>
//       <Head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Share+Tech&display=swap"
//           rel="stylesheet"
//         />
//       </Head>

//       <SessionProvider session={session}>
//         <Component {...pageProps} />
//       </SessionProvider>
//     </>
//   );
// }

import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Layout from "./Components/Layout";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
// import Layout from "../Components/Layout"; // ✅ عدل المسار

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