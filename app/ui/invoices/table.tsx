"use client";

import Image from "next/image";
import { UpdateInvoice, DeleteInvoice } from "@/app/ui/invoices/buttons";
import InvoiceStatus from "@/app/ui/invoices/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { useState, useEffect, useCallback } from "react";
import type { InvoicesTable } from "@/app/lib/definitions";

// Use the InvoiceWithCustomer type from definitions.ts
export type FetchedInvoice = InvoicesTable;

export default function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [sortField, setSortField] = useState<
    "name" | "email" | "amount" | "date"
  >("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [invoices, setInvoices] = useState<InvoicesTable[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch and sort invoices
  const fetchAndSortInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/invoices?query=${query}&page=${currentPage}`
      );
      if (!response.ok) throw new Error("Failed to fetch invoices");
      const data: InvoicesTable[] = await response.json();

      // Filter by status first
      const filteredData =
        statusFilter === "all"
          ? data
          : data.filter(
              (invoice: InvoicesTable) => invoice.status === statusFilter
            );

      const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          const stringA = aValue ?? "";
          const stringB = bValue ?? "";
          return sortDirection === "asc"
            ? stringA.localeCompare(stringB)
            : stringB.localeCompare(stringA);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (sortField === "date") {
          const dateA = aValue ? new Date(aValue).getTime() : 0;
          const dateB = bValue ? new Date(bValue).getTime() : 0;
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        }

        return 0;
      });
      setInvoices(sortedData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, currentPage, sortField, sortDirection, statusFilter]);

  // Initial fetch
  useEffect(() => {
    fetchAndSortInvoices();
  }, [fetchAndSortInvoices]); // Added fetchAndSortInvoices to the dependency array

  if (isLoading) {
    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </div>
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="h-4 w-16 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Customer
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Status
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {[...Array(6)].map((_, i) => (
                  <tr
                    key={i}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div className="h-4 w-24 rounded bg-gray-200" />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-4 w-16 rounded bg-gray-200" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-4 w-16 rounded bg-gray-200" />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <div className="h-8 w-8 rounded bg-gray-200" />
                        <div className="h-8 w-8 rounded bg-gray-200" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-5 font-medium sm:pl-6 cursor-pointer"
                  onClick={() => {
                    setSortField("name");
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  }}
                >
                  Customer{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium cursor-pointer"
                  onClick={() => {
                    setSortField("email");
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  }}
                >
                  Email{" "}
                  {sortField === "email" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium cursor-pointer"
                  onClick={() => {
                    setSortField("amount");
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  }}
                >
                  Amount{" "}
                  {sortField === "amount" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium cursor-pointer"
                  onClick={() => {
                    setSortField("date");
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  }}
                >
                  Date{" "}
                  {sortField === "date" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
