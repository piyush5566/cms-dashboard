"use client";

import Image from "next/image";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { Customer } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";
import { useState, useEffect } from "react";
import Pagination from "./pagination";

export default function CustomersTable({
  searchQuery,
  currentPage,
}: {
  searchQuery: string;
  currentPage: number;
}) {
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch customers with pagination
  const fetchCustomers = async (page: number) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        query: searchQuery,
        page: page.toString(),
        status: statusFilter,
        sort: sortField,
        direction: sortDirection,
      });
      const response = await fetch(`/api/customers?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      return { customers: [], totalPages: 1 };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    const data = await fetchCustomers(page);
    if (data.customers) {
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
      window.history.pushState(
        {},
        "",
        `/dashboard/customers?page=${page}&query=${searchQuery}&status=${statusFilter}&sort=${sortField}&direction=${sortDirection}`
      );
    }
  };

  // Handle sort change
  const handleSortChange = async (field: keyof Customer) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    const data = await fetchCustomers(1);
    if (data.customers) {
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
      window.history.pushState(
        {},
        "",
        `/dashboard/customers?page=1&query=${searchQuery}&status=${statusFilter}&sort=${field}&direction=${newDirection}`
      );
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = async (
    status: "all" | "active" | "inactive"
  ) => {
    try {
      setIsLoading(true);
      setStatusFilter(status);

      const params = new URLSearchParams({
        query: searchQuery,
        page: "1",
        status: status,
        sort: sortField,
        direction: sortDirection,
      });

      const response = await fetch(`/api/customers?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();

      if (data.customers) {
        setCustomers(data.customers);
        setTotalPages(data.totalPages);
        window.history.pushState(
          {},
          "",
          `/dashboard/customers?page=1&query=${searchQuery}&status=${status}&sort=${sortField}&direction=${sortDirection}`
        );
      }
    } catch (error) {
      console.error("Error updating status filter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          query: searchQuery,
          page: currentPage.toString(),
          status: statusFilter,
          sort: sortField,
          direction: sortDirection,
        });

        const response = await fetch(`/api/customers?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();

        if (isMounted && data.customers) {
          setCustomers(data.customers);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Error loading customers:", error);
        if (isMounted) {
          setCustomers([]);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, statusFilter, sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="flex items-center justify-between gap-2 p-4">
                <div className="flex items-center gap-2">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                  <div className="h-8 w-32 rounded bg-gray-200" />
                </div>
              </div>

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
                      <div className="flex justify-between gap-4">
                        <div className="h-4 w-16 rounded bg-gray-200" />
                        <div className="h-4 w-24 rounded bg-gray-200" />
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
                            className="px-3 py-5 font-medium w-[10%] bg-gray-50 text-center"
                          >
                            Orders
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-5 font-medium w-[10%] bg-gray-50 text-right"
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
                              <div className="h-4 w-24 rounded bg-gray-200" />
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                              <div className="h-4 w-16 rounded bg-gray-200" />
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-center">
                              <div className="h-4 w-8 rounded bg-gray-200" />
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-right">
                              <div className="h-4 w-20 rounded bg-gray-200" />
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                              <div className="h-4 w-24 rounded bg-gray-200" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="flex items-center justify-between gap-2 p-4">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    handleStatusFilterChange(
                      e.target.value as "all" | "active" | "inactive"
                    )
                  }
                  className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="md:hidden">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <Image
                        src={customer.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${customer.name}'s profile picture`}
                      />
                      <p>{customer.name}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.status}
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-gray-500">{customer.email}</p>
                      <p className="text-sm text-gray-500">
                        {customer.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.totalOrders} orders
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
                          className="px-4 py-5 font-medium sm:pl-6 w-[25%] bg-gray-50 cursor-pointer"
                          onClick={() => handleSortChange("name")}
                        >
                          Customer{" "}
                          {sortField === "name" &&
                            (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[20%] bg-gray-50 cursor-pointer"
                          onClick={() => handleSortChange("email")}
                        >
                          Email{" "}
                          {sortField === "email" &&
                            (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[15%] bg-gray-50 cursor-pointer"
                          onClick={() => handleSortChange("company")}
                        >
                          Company{" "}
                          {sortField === "company" &&
                            (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[10%] bg-gray-50"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[10%] bg-gray-50 text-center cursor-pointer"
                          onClick={() => handleSortChange("totalOrders")}
                        >
                          Orders{" "}
                          {sortField === "totalOrders" &&
                            (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[10%] bg-gray-50 text-right cursor-pointer"
                          onClick={() => handleSortChange("totalSpent")}
                        >
                          Total Spent{" "}
                          {sortField === "totalSpent" &&
                            (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-5 font-medium w-[10%] bg-gray-50 cursor-pointer"
                          onClick={() => handleSortChange("lastOrderDate")}
                        >
                          Last Order{" "}
                          {sortField === "lastOrderDate" &&
                            (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {customers.map((customer) => (
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
                              <p>{customer.name}</p>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            {customer.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            {customer.company}
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
                          <td className="whitespace-nowrap px-3 py-3 text-center">
                            {customer.totalOrders}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-right">
                            {formatCurrency(customer.totalSpent)}
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
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
