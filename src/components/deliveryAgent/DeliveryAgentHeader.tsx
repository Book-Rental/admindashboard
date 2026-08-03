import { FaChevronDown } from "react-icons/fa";
import { Search } from "@rentbook/rentbook-ui-lib";
import { useHubs } from "../../hooks/useHubs";

interface DeliveryAgentHeaderProps {
  hubId: string;
}

const DeliveryAgentHeader = ({ hubId }: DeliveryAgentHeaderProps) => {
  const { data, isLoading } = useHubs();

  const hub = data?.data?.find((item) => item._id === hubId);

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

      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-3">
          <Search
            placeholder="Search agents by name, email or phone..."
            containerClassName="w-56 sm:w-64"
          />

          <button className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold uppercase">
              {isLoading ? "--" : hub?.hubId?.slice(0, 2) || "--"}
            </div>

  
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight whitespace-nowrap">
                {isLoading ? "Loading..." : hub?.hubId || "Unknown Hub"}
              </p>
            </div>

            <FaChevronDown className="text-slate-400 text-xs hidden sm:block" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentHeader;