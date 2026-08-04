import {
  FaUsers,
  FaMotorcycle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { Agent } from "../../types/agent";

interface StatsCardsProps {
  agents: Agent[];
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5">
      <div className="flex items-center gap-4">
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <div className={`text-lg ${iconColor}`}>
            {icon}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-slate-800">
            {value}
          </h2>

          <p className="text-xs text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({
  agents,
}: StatsCardsProps) => {
  const totalAgents = agents.length;

  const activeAgents = agents.filter(
    (agent) => agent.status === "Active"
  ).length;

  const onDeliveryAgents = agents.filter(
    (agent) => agent.status === "OnDelivery"
  ).length;

  const inactiveAgents = agents.filter(
    (agent) => agent.status === "Inactive"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      <StatCard
        title="Total Agents"
        value={totalAgents}
        subtitle="Registered agents"
        icon={<FaUsers />}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatCard
        title="Active Agents"
        value={activeAgents}
        subtitle="Currently Active"
        icon={<FaCheckCircle />}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />

      <StatCard
        title="On Delivery"
        value={onDeliveryAgents}
        subtitle="Currently Delivering"
        icon={<FaMotorcycle />}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />

      <StatCard
        title="Inactive Agents"
        value={inactiveAgents}
        subtitle="Unavailable"
        icon={<FaTimesCircle />}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />

    </div>
  );
};

export default StatsCards;