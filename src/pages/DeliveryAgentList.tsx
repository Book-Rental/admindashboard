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

const hubId = "6a6aeb9b18b80d35a476f97d";
const DeliveryAgentList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
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
    setSelectedAgentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedAgentId) return;

    deleteAgentMutation.mutate(
      {
        id: selectedAgentId,
        updatedBy: selectedAgentId,
      },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedAgentId("");
        },
      }
    );
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