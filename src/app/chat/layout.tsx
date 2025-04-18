export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      </body>
  );
}