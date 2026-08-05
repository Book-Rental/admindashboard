import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaUserClock,
} from "react-icons/fa";

import { AgentAnalytics } from "../../types/agent";

interface StatsCardsProps {
  analytics: AgentAnalytics;
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
          <div className={`text-base ${iconColor}`}>
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
  analytics,
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      <StatCard
        title="Total Agents"
        value={analytics.totalAgents}
        subtitle="Registered agents"
        icon={<FaUsers />}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatCard
        title="Active Agents"
        value={analytics.activeAgents}
        subtitle="Currently Active"
        icon={<FaCheckCircle />}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />

      <StatCard
        title="Off Duty"
        value={analytics.offDutyAgents}
        subtitle="Currently Off Duty"
        icon={<FaUserClock />}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />

      <StatCard
        title="Inactive Agents"
        value={analytics.inactiveAgents}
        subtitle="Unavailable"
        icon={<FaTimesCircle />}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />

    </div>
  );
};

export default StatsCards;