import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import FloatingChatbot from "../components/common/FloatingChatbot.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      <Footer />
      <FloatingChatbot />
    </div>
  );
}

