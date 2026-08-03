interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<string, string> = {
    Active: "bg-green-50 text-green-700 border border-green-200",
    "On Delivery": "bg-amber-50 text-amber-700 border border-amber-200",
    Inactive: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ??
        "bg-slate-100 text-slate-700 border border-slate-200"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;