import { useMemo, useState } from "react";
import { Rb_Button, Rb_LoadingSpinner } from "@rentbook/rentbook-ui-lib";
import { FaArrowLeft } from "react-icons/fa";

import { useBag, useBagParcels } from "../hooks/useBags";
import { useHubs } from "../hooks/useHubs";
import { useHubById } from "../hooks/useHubById";
import { useAgents } from "../hooks/useAgents";
import { useUpdateBagStatus } from "../hooks/useBagActions";
import BagStatusBadge from "../components/bag/BagStatusBadge";
import BagStatusStepper from "../components/bag/BagStatusStepper";

import AssignBagAgentModal from "../components/bag/AssignBagAgentModal";
import { getNextAction, goTo } from "../components/bag/bagFlow";
import { getShipmentLabelPdfUrl } from "../api/bagApi";
import { showToast } from "../utils/showToaster";
import { getErrorMessage } from "../utils/getErrorMessage";
import BagVerification from "../components/bag/BagVerification";

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const Info = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-600">
      {value}
    </p>
  </div>
);

export default function BagDetails() {
  const bagId = useMemo(
    () => window.location.pathname.split("/")[2],
    []
  );

  const hubMongoId = window.HOST_USER_INFO?.referenceId ?? "";
  const { data: myHubData } = useHubById(hubMongoId);
  const myHubId = myHubData?.data?.hubId ?? "";

  const { data, isLoading, isError } = useBag(bagId);
  const { data: hubsData } = useHubs();
  const { data: agentsData } = useAgents(hubMongoId, 1, 100);
  const updateStatus = useUpdateBagStatus();

  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const bag = data?.data;
  const parcelQueries = useBagParcels(bag?.shipmentIds ?? []);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Rb_LoadingSpinner />
      </div>
    );
  }

  if (isError || !bag) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-lg text-red-500">
        Failed to load bag details.
      </div>
    );
  }

  const hubName = (hubId: string) =>
    hubsData?.data.find((h) => h.hubId === hubId)?.hubName ?? hubId;

  const agentName = (agentId?: string) => {
    if (!agentId) return "Not assigned";
    return (
      agentsData?.data.agents.find((a) => a.agentId === agentId)
        ?.fullName ?? agentId
    );
  };

  const nextAction = getNextAction(bag.status);

  // Hub users can only do the steps that belong to their hub.
  // Users without a hub (admin) can do every step.
  const canActFor = (side: "source" | "destination") =>
    !myHubId ||
    (side === "source"
      ? bag.fromHubId === myHubId
      : bag.toHubId === myHubId);

  const canShowAction = nextAction ? canActFor(nextAction.side) : false;
  const canVerify = canActFor("destination");

  const runStatusUpdate = async (
    status: NonNullable<typeof nextAction>["next"],
    assignedAgentId?: string
  ) => {
    try {
      await updateStatus.mutateAsync({
        bagId: bag.bagId,
        status,
        assignedAgentId,
      });
      showToast("Bag status updated", "success");
      setIsAgentModalOpen(false);
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to update bag"), "error");
    }
  };

  const handlePrimaryAction = () => {
    if (!nextAction) return;
    if (nextAction.needsAgent) {
      setIsAgentModalOpen(true);
      return;
    }
    runStatusUpdate(nextAction.next);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <button
          onClick={() => goTo("/bags")}
          className="mb-6 flex items-center gap-2 font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <FaArrowLeft size={16} />
          Back to Bags
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Bag
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-700">
                {bag.bagId}
              </h3>

              <div className="mt-5 flex flex-wrap gap-8">
                <Info label="From" value={hubName(bag.fromHubId)} />
                <Info label="To" value={hubName(bag.toHubId)} />
                <Info label="Parcels" value={bag.shipmentIds.length} />
                <Info
                  label="Agent"
                  value={agentName(bag.assignedAgentId)}
                />
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <BagStatusBadge status={bag.status} />
              {nextAction && canShowAction && (
                <Rb_Button
                  type="button"
                  onClick={handlePrimaryAction}
                  isLoading={updateStatus.isPending}
                  disabled={
                    updateStatus.isPending ||
                    (bag.status === "CREATED" &&
                      bag.shipmentIds.length === 0)
                  }
                >
                  {nextAction.label}
                </Rb_Button>
              )}
              {bag.status === "CREATED" &&
                bag.shipmentIds.length === 0 && (
                  <p className="text-xs text-slate-400">
                    Add parcels from the Orders page before sealing.
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {/* Progress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-base font-semibold text-slate-800">
              Bag Progress
            </h2>
            <BagStatusStepper status={bag.status} />

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
              <Info label="Sealed" value={formatDateTime(bag.sealedAt)} />
              <Info
                label="Dispatched"
                value={formatDateTime(bag.dispatchedAt)}
              />
              <Info label="Arrived" value={formatDateTime(bag.arrivedAt)} />
              <Info
                label="Received"
                value={formatDateTime(bag.receivedAt)}
              />
              <Info
                label="Released"
                value={formatDateTime(bag.releasedAt)}
              />
            </div>
          </div>

          {bag.status === "OPENED" && (
            <BagVerification bag={bag} canAct={canVerify} />
          )}

          {/* Parcels */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Parcels in this Bag
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-600">
                    <th className="py-3 font-semibold">AWB</th>
                    <th className="py-3 font-semibold">Receiver</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 font-semibold">Verified</th>
                    <th className="py-3 text-right font-semibold">
                      Label
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bag.shipmentIds.map((id, index) => {
                    const query = parcelQueries[index];
                    const parcel = query?.data?.data;
                    const verified = bag.verifiedShipmentIds.includes(id);

                    return (
                      <tr key={id} className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-700">
                          {parcel?.awbNumber ??
                            (query?.isLoading ? "Loading..." : id)}
                        </td>
                        <td className="py-3 text-gray-700">
                          {parcel?.receiver?.name ?? "-"}
                          {parcel?.receiver?.city && (
                            <span className="block text-xs text-gray-500">
                              {parcel.receiver.city}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-gray-700">
                          {parcel?.currentStatus ?? "-"}
                        </td>
                        <td className="py-3">
                          {verified ? (
                            <span className="font-medium text-emerald-600">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="text-gray-400">Pending</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {parcel?.awbNumber && (
                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  getShipmentLabelPdfUrl(parcel.awbNumber),
                                  "_blank"
                                )
                              }
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              Print label
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {bag.shipmentIds.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-gray-400"
                      >
                        No parcels in this bag yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AssignBagAgentModal
        isOpen={isAgentModalOpen}
        hubMongoId={hubMongoId}
        isSubmitting={updateStatus.isPending}
        onClose={() => setIsAgentModalOpen(false)}
        onConfirm={(agentId) => runStatusUpdate("ASSIGNED", agentId)}
      />
    </div>
  );
}
