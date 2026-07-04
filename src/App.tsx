import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SchoolProvider } from "@/context/SchoolContext";
import Navbar from "@/components/public/Navbar";
import NoticeTicker from "@/components/public/NoticeTicker";
import Footer from "@/components/public/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Notifications from "@/pages/Notifications";
import Events from "@/pages/Events";
import Results from "@/pages/Results";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <NoticeTicker />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" component={() => <PublicLayout><About /></PublicLayout>} />
      <Route path="/notifications" component={() => <PublicLayout><Notifications /></PublicLayout>} />
      <Route path="/events" component={() => <PublicLayout><Events /></PublicLayout>} />
      <Route path="/results" component={() => <PublicLayout><Results /></PublicLayout>} />
      <Route path="/contact" component={() => <PublicLayout><Contact /></PublicLayout>} />
      <Route path="/admin" component={Admin} />
      <Route component={() => (
        <PublicLayout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <p className="font-serif text-6xl font-bold text-primary mb-4">404</p>
              <p className="text-foreground text-xl font-semibold mb-2">Page Not Found</p>
              <a href="/" className="text-primary underline">Return to Home</a>
            </div>
          </div>
        </PublicLayout>
      )} />
    </Switch>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <ScrollToTop />
        <Router />
      </WouterRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(45 25% 98%)",
            color: "hsl(0 0% 13%)",
            border: "1px solid hsl(150 15% 82%)",
            borderRadius: "12px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(21, 83, 47, 0.12)",
          },
          success: {
            iconTheme: { primary: "hsl(152 60% 26%)", secondary: "white" },
          },
          error: {
            iconTheme: { primary: "hsl(0 72% 51%)", secondary: "white" },
          },
        }}
      />
    </SchoolProvider>
  );
}
