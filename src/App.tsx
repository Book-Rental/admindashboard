import { useEffect, useState } from "react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import "@rentbook/rentbook-ui-lib/microfrontend.min.css";

import OrderList from "./pages/OrderList";
import AgentList from "./pages/AgentList";
import AddAgent from "./pages/AddAgent";
import EditAgent from "./pages/EditAgent";

import Sidebar from "./components/sidebar";
import AgentDetails from "./pages/AgentDetails";

const client = new QueryClient();

function Router() {
  const [path, setPath] = useState(
    window.location.pathname
  );

  useEffect(() => {
    const onPopState = () => {
      console.log(
        "PopState path:",
        window.location.pathname
      );

      setPath(window.location.pathname);
    };

    window.addEventListener(
      "popstate",
      onPopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        onPopState
      );
    };
  }, []);

  // Remove trailing slash
  const currentPath =
    path.replace(/\/+$/, "") || "/";

  console.log("Router currentPath:", currentPath);

  if (currentPath === "/agents") {
    return <AgentList />;
  }

  if (currentPath === "/agents/new") {
    return <AddAgent />;
  }
  if (
    /^\/agents\/[^/]+\/edit$/.test(
      currentPath
    )
  ) {
    console.log(
      "Matched EditAgent route"
    );

    return <EditAgent />;
  }
  if (
    /^\/agents\/[^/]+$/.test(
      currentPath
    )
  ) {
    console.log(
      "Matched AgentDetails route"
    );

    return <AgentDetails />;
  }

  if (
    currentPath === "/orders" ||
    currentPath.startsWith("/orders/")
  ) {
    return <OrderList />;
  }



  console.log(
    "No route matched:",
    currentPath
  );

  return <OrderList />;
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