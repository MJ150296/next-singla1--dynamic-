import Header from "../components/Header/Header";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="w-full flex flex-col fixed z-30">
        <Header />
        <Navbar />
      </header>
      <main className="pt-32">{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}