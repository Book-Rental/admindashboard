import DeliveryAgentHeader from "../components/deliveryAgent/DeliveryAgentHeader";
import StatsCards from "../components/deliveryAgent/StatsCards";
import AgentTable from "../components/deliveryAgent/AgentTable";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Rb_Button,
} from "@rentbook/rentbook-ui-lib";

import { useAgents, useDeleteAgent } from "../hooks/useAgents";
import { showToast } from "../utils/showToaster";
import { AxiosError } from "axios";

const DeliveryAgentList = () => {
    const hubId = window.HOST_USER_INFO?.referenceId ?? "";
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");

  const deleteAgentMutation = useDeleteAgent();

  const { data, isLoading, isError } = useAgents(hubId, page, limit);

  useEffect(() => {
    const event = new CustomEvent("widget-loading-status", {
      detail: isLoading,
    });

    window.dispatchEvent(event);
  }, [isLoading]);
  const handleAdd = () => {
    window.history.pushState(
      {},
      "",
      `/agents/new`
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
    setSelectedAgentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedAgentId) return;
    deleteAgentMutation.mutate({ id: selectedAgentId, updatedBy: selectedAgentId, }, {
      onSuccess: () => { setShowDeleteModal(false); setSelectedAgentId(""); showToast("Agent deleted successfully", "success"); },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError<{ message?: string; }>;
        const message = axiosError.response?.data?.message || (error instanceof Error ? error.message : "Failed to delete agent");
        showToast(message, "error");
      },
    });
  };

  const closeDeleteModal = () => {
    if (deleteAgentMutation.isPending) return;

    setShowDeleteModal(false);
    setSelectedAgentId("");
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
const filteredAgents =
  data?.data.agents.filter((agent) => {
    const query = search.toLowerCase();

    return (
      agent.fullName.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      agent.phoneNumber.includes(query)
    );
  }) ?? [];
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
     <DeliveryAgentHeader
  hubId={hubId}
  search={search}
  onSearchChange={setSearch}
/>

   <StatsCards analytics={data.data.analytics} />

      <AgentTable
        agents={filteredAgents}
        // agents={data.data.agents}
        meta={data.data.meta}
        currentPage={page}
        onPageChange={setPage}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
      >
        <ModalHeader onClose={closeDeleteModal}>
          Delete Agent
        </ModalHeader>

        <ModalBody>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this agent?
          </p>

          <p className="mt-2 text-xs text-red-500">
            This action cannot be undone.
          </p>
        </ModalBody>

        <ModalFooter>
          <Rb_Button
            type="button"
            variant="secondary"
            onClick={closeDeleteModal}
            disabled={deleteAgentMutation.isPending}
          >
            Cancel
          </Rb_Button>

          <Rb_Button
            type="button"
            onClick={confirmDelete}
            isLoading={deleteAgentMutation.isPending}
          >
            Delete Agent
          </Rb_Button>
        </ModalFooter>
      </Modal>
    </div>

  );
};

export default DeliveryAgentList;