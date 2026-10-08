import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/Services").then(module => ({ default: module.ServiceDetail })));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogCategory = lazy(() => import("@/pages/Blog").then(module => ({ default: module.BlogCategory })));
const BlogArticle = lazy(() => import("@/pages/Blog").then(module => ({ default: module.BlogArticle })));

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
