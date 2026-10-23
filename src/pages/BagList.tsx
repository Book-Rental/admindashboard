import { useEffect, useMemo, useState } from "react";
import {
  Rb_Button,
  Rb_LoadingSpinner,
  Dropdown,
} from "@rentbook/rentbook-ui-lib";

import { useBags } from "../hooks/useBags";
import { useHubs } from "../hooks/useHubs";
import { useHubById } from "../hooks/useHubById";
import AddToBagModal from "../components/bag/AddToBagModal";
import BagStatusBadge from "../components/bag/BagStatusBadge";
import { BAG_STEPS, goTo } from "../components/bag/bagFlow";

type Direction = "all" | "outgoing" | "incoming";

const DIRECTIONS: { label: string; value: Direction }[] = [
  { label: "All", value: "all" },
  { label: "Outgoing", value: "outgoing" },
  { label: "Incoming", value: "incoming" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  ...BAG_STEPS.map((s) => ({ label: s.label, value: s.status })),
];

export default function BagList() {
  const hubMongoId = window.HOST_USER_INFO?.referenceId ?? "";
  const { data: myHubData } = useHubById(hubMongoId);
  const myHubId = myHubData?.data?.hubId ?? "";

  const { data, isLoading, isError } = useBags();
  const { data: hubsData } = useHubs();

  const [direction, setDirection] = useState<Direction>("all");
  const [status, setStatus] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("widget-loading-status", { detail: isLoading })
    );
  }, [isLoading]);

  useEffect(() => {
    if (isError) {
      window.dispatchEvent(
        new CustomEvent("app-toast-notification", {
          detail: { message: "Failed to load bags", type: "error" },
        })
      );
    }
  }, [isError]);

  const hubName = (hubId: string) =>
    hubsData?.data.find((h) => h.hubId === hubId)?.hubName ?? hubId;

  const bags = useMemo(() => {
    return (data?.data ?? []).filter((bag) => {
      if (status && bag.status !== status) return false;
      if (myHubId && direction === "outgoing")
        return bag.fromHubId === myHubId;
      if (myHubId && direction === "incoming")
        return bag.toHubId === myHubId;
      if (myHubId) {
        // Hub users only see bags that start or end at their hub.
        return bag.fromHubId === myHubId || bag.toHubId === myHubId;
      }
      return true;
    });
  }, [data, direction, status, myHubId]);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold sm:text-3xl">Bags</h1>
        <Rb_Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
        >
          Create Bag
        </Rb_Button>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {DIRECTIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDirection(d.value)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                direction === d.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="w-full lg:w-56">
          <Dropdown
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            placeholder="Bag Status"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Rb_LoadingSpinner />
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="p-4 font-semibold">Bag ID</th>
                <th className="p-4 font-semibold">From</th>
                <th className="p-4 font-semibold">To</th>
                <th className="p-4 font-semibold">Parcels</th>
                <th className="p-4 font-semibold">Created</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bags.map((bag) => (
                <tr
                  key={bag.bagId}
                  onClick={() => goTo(`/bags/${bag.bagId}`)}
                  className="cursor-pointer border-b border-gray-200 transition hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-700">
                    {bag.bagId}
                  </td>
                  <td className="p-4 text-gray-700">
                    {hubName(bag.fromHubId)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {hubName(bag.toHubId)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {bag.shipmentIds.length}
                  </td>
                  <td className="whitespace-nowrap p-4 text-gray-600">
                    {new Date(bag.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    <BagStatusBadge status={bag.status} />
                  </td>
                </tr>
              ))}

              {bags.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-400"
                  >
                    No bags found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddToBagModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        shipmentIds={[]}
        onDone={(bagId) => goTo(`/bags/${bagId}`)}
      />
    </div>
  );
}
