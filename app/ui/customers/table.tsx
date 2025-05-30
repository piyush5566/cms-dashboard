"use client";

import Image from "next/image";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { Customer } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";
import { useState } from "react";
import Pagination from "./pagination";

export default function CustomersTable({
  customers,
  searchQuery,
  currentPage,
}: {
  customers: Customer[];
  searchQuery: string;
  currentPage: number;
}) {
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const itemsPerPage = 6;

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate summary statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue =
    totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="flex items-center justify-between gap-2 p-4">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm appearance-none pr-8"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "active" | "inactive"
                    )
                  }
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="md:hidden">
              {paginatedCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Image
                          src={customer.image_url}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={`${customer.name}'s profile picture`}
                        />
                        <p>{customer.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          customer.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-gray-500">
                        {customer.totalOrders} orders
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="relative h-[calc(100vh-22rem)]">
                <div className="absolute inset-0 overflow-auto">
                  <table className="min-w-full text-gray-900">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-50">
                        <th
                          scope="col"
                          className="px-4 py-5 font-medium sm:pl-6 w-[25%] bg-gray-50"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[20%] bg-gray-50"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[15%] bg-gray-50"
                        >
                          Company
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[10%] bg-gray-50"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[10%] bg-gray-50"
                        >
                          Orders
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[10%] bg-gray-50"
                        >
                          Total Spent
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[10%] bg-gray-50"
                        >
                          Last Order
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {paginatedCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                          <td className="whitespace-nowrap py-3 pl-6 pr-3">
                            <div className="flex items-center gap-3">
                              <Image
                                src={customer.image_url}
                                className="rounded-full"
                                width={28}
                                height={28}
                                alt={`${customer.name}'s profile picture`}
                              />
                              <p
                                className="truncate max-w-[200px]"
                                title={customer.name}
                              >
                                {customer.name}
                              </p>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            <p
                              className="truncate max-w-[180px]"
                              title={customer.email}
                            >
                              {customer.email}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            <p
                              className="truncate max-w-[120px]"
                              title={customer.company}
                            >
                              {customer.company}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                customer.status === "active"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-50 text-gray-700"
                              }`}
                            >
                              {customer.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            {customer.totalOrders || 0}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            {formatCurrency(customer.totalSpent || 0)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            {customer.lastOrderDate
                              ? new Date(
                                  customer.lastOrderDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-center border-t border-gray-200 bg-white px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("page", page.toString());
                    window.location.href = url.toString();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
