import { BagStatus } from "../../types/bag";
import { BAG_STATUS_LABEL, getBadgeClass } from "./bagFlow";

export default function BagStatusBadge({
  status,
}: {
  status: BagStatus;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium sm:px-3 ${getBadgeClass(
        status
      )}`}
    >
      {BAG_STATUS_LABEL[status] ?? status}
    </span>
  );
}
