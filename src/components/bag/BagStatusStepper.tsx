import { BagStatus } from "../../types/bag";
import { BAG_STEPS } from "./bagFlow";

export default function BagStatusStepper({
  status,
}: {
  status: BagStatus;
}) {
  const currentIndex = BAG_STEPS.findIndex((s) => s.status === status);

  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-[720px] items-start">
        {BAG_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={step.status} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={`h-0.5 flex-1 ${
                    index === 0
                      ? "bg-transparent"
                      : index <= currentIndex
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                />
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    done
                      ? "bg-blue-600 text-white"
                      : active
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {done ? "✓" : index + 1}
                </div>
                <div
                  className={`h-0.5 flex-1 ${
                    index === BAG_STEPS.length - 1
                      ? "bg-transparent"
                      : index < currentIndex
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                />
              </div>
              <span
                className={`mt-2 text-xs ${
                  active ? "font-semibold text-gray-900" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
