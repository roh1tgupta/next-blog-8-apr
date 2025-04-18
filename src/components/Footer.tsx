export default function Footer() {
  return (
    <footer className="bg-primary text-white p-4 text-center">
      <p>© {new Date().getFullYear()} My Blog. All rights reserved.</p>
    </footer>
  );
}