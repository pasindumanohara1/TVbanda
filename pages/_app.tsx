import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from 'next/font/google';
import Layout from "@/components/Layout";
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://pl28963428.profitablecpmratenetwork.com/62/02/53/620253ef8bbcb5cce16dca0e9c0df454.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://pl28963434.profitablecpmratenetwork.com/23/6d/00/236d007405235e81c2bcaabe2eab93c0.js';
    script2.async = true;
    document.body.appendChild(script2);

    (window as any).atOptions = {
      'key': '13f611862530e5d2b1733b67657704e5',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <main className={inter.className}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}