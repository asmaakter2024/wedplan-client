import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Friendly "nothing here yet" block with an optional call-to-action.
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-rose-100">
        <Icon className="size-6 text-rose-600" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-gray-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
