import DeliveryAgentHeader from "../components/deliveryAgent/DeliveryAgentHeader";
import StatsCards from "../components/deliveryAgent/StatsCards";
import AgentTable from "../components/deliveryAgent/AgentTable";

import { useAgents } from "../hooks/useAgents";
import { useState } from "react";
const hubId = "6a6b1b99f447531ecb350f64";
const DeliveryAgentList = () => {
const [page, setPage] = useState(1);
const limit = 10;


  const { data, isLoading, isError } = useAgents(hubId, page, limit);
const handleAdd = () => {
  window.history.pushState(
    {},
    "",
    `/agents/new?hubId=${hubId}`
  );

  window.dispatchEvent(new PopStateEvent("popstate"));
};

const handleView = (id: string) => {
  window.history.pushState({}, "", `/agents/${id}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const handleEdit = (id: string) => {
  window.history.pushState({}, "", `/agents/${id}/edit`);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const handleDelete = (id: string) => {
  console.log("Delete Agent:", id);

  // Later you'll open your delete confirmation modal here.
};
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        Loading agents...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-red-500">
        Failed to load agents.
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <DeliveryAgentHeader hubId={hubId} />

      <StatsCards agents={data.data.agents} />

      <AgentTable
  agents={data.data.agents}
  meta={data.data.meta}
  currentPage={page}
  onPageChange={setPage}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onAdd={handleAdd}
/>
    </div>
  );
};

export default DeliveryAgentList;