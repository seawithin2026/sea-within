export const dynamic = "force-dynamic";
export const revalidate = 0;

import ClientLayout from "./ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/images/jellyfish-bg.jpg" />
        <link rel="preload" as="image" href="/images/bloom-hero-flowers.jpg" />
      </head>

      <body className="bg-sanctuary-dark text-sea-100 antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
