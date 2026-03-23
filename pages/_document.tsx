import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="monetag" content="7b4aef6bd83e02ddc4f59fa549cd5d61" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="TVbanda - Watch live TV channels from around the world. Free IPTV streaming with movies, sports, news, and more." />
        <meta name="keywords" content="IPTV, live TV, streaming, movies, sports, news, free TV, watch online" />
        <meta name="author" content="TVbanda" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#0a0a0a" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tv-banda.vercel.app/" />
        <meta property="og:title" content="TVbanda - Free Live TV Streaming" />
        <meta property="og:description" content="Watch live TV channels from around the world. Free IPTV streaming with movies, sports, news, and more." />
        <meta property="og:image" content="https://tv-banda.vercel.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tv-banda.vercel.app/" />
        <meta property="twitter:title" content="TVbanda - Free Live TV Streaming" />
        <meta property="twitter:description" content="Watch live TV channels from around the world. Free IPTV streaming with movies, sports, news, and more." />
        <meta property="twitter:image" content="https://tv-banda.vercel.app/og-image.png" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* PWA */}
        <link rel="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}