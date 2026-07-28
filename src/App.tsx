import { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css";

import OrderList from "./pages/OrderList";
import ProductList from "./pages/ProductList";
import Sidebar from "./components/sidebar";

const client = new QueryClient();

function Router() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (path.startsWith("/orders")) return <OrderList />;
  if (path.startsWith("/products")) return <ProductList />;

  // default landing page
  return <ProductList />;
}

function App() {
  return (
    <QueryClientProvider client={client}>
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 min-w-0 pt-16 md:pt-0">
          <Router />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;