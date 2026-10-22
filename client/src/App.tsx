import { Switch, Route, useLocation } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { trackPageview } from "@/lib/analytics";
import Home from "@/pages/Home";
const NotFound = lazy(() => import("@/pages/not-found"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/Services").then(module => ({ default: module.ServiceDetail })));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogCategory = lazy(() => import("@/pages/Blog").then(module => ({ default: module.BlogCategory })));
const BlogArticle = lazy(() => import("@/pages/Blog").then(module => ({ default: module.BlogArticle })));

function RouteAnalytics() {
  const [location] = useLocation();
  useEffect(() => {
    // Defer past the page's own effect so document.title is already set.
    const timer = window.setTimeout(() => trackPageview(location), 300);
    return () => window.clearTimeout(timer);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Suspense fallback={<div className="agency-site min-h-screen grid place-items-center" role="status" aria-label="Loading page"><span className="size-6 rounded-full border-2 border-border border-t-primary motion-safe:animate-spin" /></div>}><Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/services/:slug">{params => <ServiceDetail slug={params.slug} />}</Route>
      <Route path="/blog"><Blog /></Route>
      <Route path="/blog/kategori/:slug">{params => <BlogCategory slug={params.slug} />}</Route>
      <Route path="/blog/:slug">{params => <BlogArticle slug={params.slug} />}</Route>
      <Route component={NotFound} />
    </Switch></Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <RouteAnalytics />
        <Router />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
