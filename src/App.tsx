import { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css";
import './index.css'

import Sidebar from "./components/sidebar";

import DeliveryAgentList from "./pages/DeliveryAgentList";
import AddAgent from "./pages/AddAgent";
import EditAgent from "./pages/EditAgent";
import AgentDetails from "./pages/AgentDetails";

const client = new QueryClient();

function Router() {
  const [path, setPath] = useState(
    window.location.pathname
  );

  useEffect(() => {
    const onPopState = () => {
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

  // Home
  if (currentPath === "/") {
    return <DeliveryAgentList />;
  }

  // Agent List
  if (currentPath === "/agents") {
    return <DeliveryAgentList />;
  }

  // Add Agent
  if (currentPath === "/agents/new") {
    return <AddAgent />;
  }

  // Edit Agent
  if (
    /^\/agents\/[^/]+\/edit$/.test(
      currentPath
    )
  ) {
    return <EditAgent />;
  }

  // Agent Details
  if (
    /^\/agents\/[^/]+$/.test(
      currentPath
    )
  ) {
    return <AgentDetails />;
  }



  return <DeliveryAgentList />;
}

function App() {
  return (
    <QueryClientProvider client={client}>
      <div className="bg-[#F5F7FB] h-screen overflow-hidden">
        <Sidebar />

        <main className="md:ml-64 h-screen overflow-y-auto">
          <Router />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;