import { Metadata } from "next";
import { Suspense } from "react";
import { CustomersTableSkeleton } from "@/app/ui/skeletons";
import CustomersTable from "@/app/ui/customers/table";
import { getCustomers } from "@/app/lib/data";
import Search from "@/app/ui/search";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Number(params?.page) || 1;
  const customers = await getCustomers();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
      </div>
      <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
        <CustomersTable
          customers={customers}
          searchQuery={query}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}
