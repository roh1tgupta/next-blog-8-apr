export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-grow mx-auto px-0 py-0">{children}</main>
    </body>
  );
}