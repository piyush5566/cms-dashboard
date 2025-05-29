import { lusitana } from "@/app/ui/fonts";
import { Revenue } from "@/app/lib/definitions";
import { fetchRevenue } from "@/app/lib/data";
import RevenueChartClient from "./revenue-chart-client";

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() {
  const revenue: Revenue[] = await fetchRevenue();

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="h-[350px] w-full">
          <RevenueChartClient revenue={revenue} />
        </div>
      </div>
    </div>
  );
}
