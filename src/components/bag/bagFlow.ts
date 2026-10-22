import { BagStatus } from "../../types/bag";

export const BAG_STEPS: { status: BagStatus; label: string }[] = [
  { status: "CREATED", label: "Created" },
  { status: "SEALED", label: "Sealed" },
  { status: "ASSIGNED", label: "Assigned" },
  { status: "IN_TRANSIT", label: "In Transit" },
  { status: "ARRIVED", label: "Arrived" },
  { status: "RECEIVED", label: "Received" },
  { status: "OPENED", label: "Opened" },
  { status: "VERIFIED", label: "Verified" },
  { status: "RELEASED", label: "Released" },
];

export const BAG_STATUS_LABEL = Object.fromEntries(
  BAG_STEPS.map((s) => [s.status, s.label])
) as Record<BagStatus, string>;

export interface BagNextAction {
  label: string;
  next: BagStatus;
  // who performs the step: the sending hub or the receiving hub
  side: "source" | "destination";
  needsAgent?: boolean;
}

// The backend only allows moving one step forward, so each
// status has exactly one valid next action.
// OPENED has none here: it moves to VERIFIED through the
// verification screen (complete-verification).
export const getNextAction = (
  status: BagStatus
): BagNextAction | null => {
  switch (status) {
    case "CREATED":
      return { label: "Seal Bag", next: "SEALED", side: "source" };
    case "SEALED":
      return {
        label: "Assign Agent",
        next: "ASSIGNED",
        side: "source",
        needsAgent: true,
      };
    case "ASSIGNED":
      return { label: "Dispatch Bag", next: "IN_TRANSIT", side: "source" };
    case "IN_TRANSIT":
      return { label: "Mark Arrived", next: "ARRIVED", side: "destination" };
    case "ARRIVED":
      return { label: "Mark Received", next: "RECEIVED", side: "destination" };
    case "RECEIVED":
      return { label: "Open Bag", next: "OPENED", side: "destination" };
    case "VERIFIED":
      return { label: "Release Bag", next: "RELEASED", side: "destination" };
    default:
      return null;
  }
};

export const getBadgeClass = (status: BagStatus) => {
  switch (status) {
    case "CREATED":
      return "bg-blue-50 text-blue-700";
    case "SEALED":
      return "bg-gray-100 text-gray-700";
    case "ASSIGNED":
      return "bg-violet-50 text-violet-700";
    case "IN_TRANSIT":
      return "bg-orange-50 text-orange-700";
    case "ARRIVED":
    case "RECEIVED":
      return "bg-cyan-50 text-cyan-700";
    case "OPENED":
      return "bg-amber-50 text-amber-700";
    case "VERIFIED":
    case "RELEASED":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const goTo = (path: string) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
