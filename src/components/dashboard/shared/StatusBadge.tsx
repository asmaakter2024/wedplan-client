import { cn } from "@/lib/utils";
import { statusClasses } from "@/lib/dashboard";

/**
 * Small colored pill for any status:
 * pending / accepted / rejected / cancelled / approved / succeeded ...
 */
const StatusBadge = ({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) => {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        statusClasses(status),
        className,
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
