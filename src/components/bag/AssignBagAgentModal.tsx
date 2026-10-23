import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Rb_Button,
  Rb_LoadingSpinner,
} from "@rentbook/rentbook-ui-lib";

import { useAgents } from "../../hooks/useAgents";

interface Props {
  isOpen: boolean;
  hubMongoId: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (agentId: string) => void;
}

export default function AssignBagAgentModal({
  isOpen,
  hubMongoId,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const { data, isLoading } = useAgents(hubMongoId, 1, 100);
  const agents = data?.data.agents ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>Assign Agent to Bag</ModalHeader>

      <ModalBody>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Rb_LoadingSpinner />
          </div>
        ) : agents.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            No agents found for this hub.
          </p>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {agents.map((agent) => {
              const selected = selectedAgentId === agent.agentId;
              return (
                <li key={agent.agentId}>
                  <button
                    type="button"
                    onClick={() => setSelectedAgentId(agent.agentId)}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {agent.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {agent.phoneNumber} · {agent.vehicle?.type}
                      </p>
                    </div>
                    <span className="ml-3 shrink-0 text-xs text-gray-500">
                      {agent.status}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ModalBody>

      <ModalFooter>
        <Rb_Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Rb_Button>
        <Rb_Button
          type="button"
          onClick={() => onConfirm(selectedAgentId)}
          isLoading={isSubmitting}
          disabled={!selectedAgentId || isSubmitting}
        >
          Assign Agent
        </Rb_Button>
      </ModalFooter>
    </Modal>
  );
}
