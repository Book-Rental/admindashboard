import { Search } from "@rentbook/rentbook-ui-lib";
import { useHubs } from "../../hooks/useHubs";

interface DeliveryAgentHeaderProps {
  hubId: string;
  search: string;
  onSearchChange: (value: string) => void;
}

const DeliveryAgentHeader = ({
  hubId,
  search,
  onSearchChange,
}: DeliveryAgentHeaderProps) => {
  const { data, isLoading } = useHubs();

  const hub = data?.data?.find((item) => item._id === hubId);

  const hubName = isLoading
    ? "Loading..."
    : hub?.hubName || "Unknown Hub";

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-[240px]">
        <h1 className="text-2xl font-bold text-slate-800">
          Delivery Agents
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your delivery agents, add new agents and keep track of their
          details.
        </p>
      </div>

      <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 min-w-0 sm:flex-none">
            <Search
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search agents by name, email or phone..."
              containerClassName="w-full sm:w-56 md:w-64"
              className="!pl-10"
            />
          </div>
          <button
            type="button"
            title={hubName}
            className="relative flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
          >
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold uppercase">
              {isLoading ? "--" : hub?.hubName?.slice(0, 2) || "--"}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight whitespace-nowrap">
                {hubName}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentHeader;