
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Daily from "@/pages/Daily";
import Weekly from "@/pages/Weekly";
import Monthly from "@/pages/Monthly";
import NextNinety from "@/pages/NextNinety";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Daily />} />
            <Route path="weekly" element={<Weekly />} />
            <Route path="monthly" element={<Monthly />} />
            <Route path="next-90" element={<NextNinety />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
};

export default App;
