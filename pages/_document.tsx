import Menu from '../components/menu'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head />
      <body className="min-h-screen bg-background font-sans antialiased">
       
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
