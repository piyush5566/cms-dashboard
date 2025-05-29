import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import clsx from "clsx";

export default function AcmeLogo({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p
        className={clsx("text-[44px]", {
          hidden: isCollapsed,
        })}
      >
        SalesPro
      </p>
      <p
        className={clsx("text-[44px]", {
          hidden: !isCollapsed,
        })}
      >
        SP
      </p>
    </div>
  );
}
