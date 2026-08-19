import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import "@rentbook/rentbook-ui-lib/microfrontend.min.css";
import "./index.css";

import Sidebar from "./components/sidebar";

import DeliveryAgentList from "./pages/DeliveryAgentList";
import AddAgent from "./pages/AddAgent";
import EditAgent from "./pages/EditAgent";
import AgentDetails from "./pages/AgentDetails";
import ShipmentList from "./pages/ShipmentList";
import ShipmentDetails from "./pages/ShipmentDetails";
import DestinationShipment from "./pages/DestinationShipment";
import HubList from "./pages/HubList";
import HubDetails from "./pages/HubDetails";
import EmployeeDetails from "./pages/EmployeeDetails";

const client = new QueryClient();

interface AppProps {
  view?:
  | "admin"
  | "agents"
  | "create-agent"
  | "agent-details"
  | "edit-agent"
  | "orders"
  | "order-details"
  | "destination-shipments"
  | "hubs"
  | "hub-details"
  | "employee-details"
}

function App({ view }: AppProps) {
  const renderView = () => {
    switch (view) {
      case "agents":
        return <DeliveryAgentList />;

      case "create-agent":
        return <AddAgent />;

      case "edit-agent":
        return <EditAgent />;

      case "agent-details":
        return <AgentDetails />;
      case "orders":
        return <ShipmentList />;
      case "order-details":
        return <ShipmentDetails />;
      case "destination-shipments":
        return <DestinationShipment />;
      case "hubs":
        return <HubList />;
      case "hub-details":
        return <HubDetails />;
      case "employee-details":
        return <EmployeeDetails />;
      case "admin":
      default:
        return <DeliveryAgentList />;
    }
  };

  return (
    <QueryClientProvider client={client}>
      <div className="bg-[#F5F7FB] min-h-screen overflow-hidden">
        <Sidebar />

        <main className="md:ml-64 min-h-screen overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;