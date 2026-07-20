export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-sanctuary-dark text-sea-100 antialiased">
        {children}
      </body>
    </html>
  );
}
