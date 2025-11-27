"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import useCurrentUser from "@/hooks/useCurrentUser";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const LIMIT = 50;

export default function DatasetPreviewPage() {
  const { user, loadingUser } = useCurrentUser();

  const [data, setData] = useState([]);
  const [datasetName, setDatasetName] = useState("Loading...");
  const [columns, setColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadPage = useCallback(
    async (page) => {
      setLoading(true);

      try {
        let url = `${API_BASE}/dataset-preview?page=${page}`;

        // ✅ User-specific dataset
        if (user?._id) {
          url += `&userId=${user._id}`;
        }

        const res = await fetch(url);
        const result = await res.json();

        setDatasetName(result.dataset || "Default dataset"); // ✅ FIXED
        setData(result.data || []);
        setPageCount(result.total_pages || 1);
        setTotalRows(result.total_rows || 0);

        if (result.data && result.data.length > 0) {
          setColumns(Object.keys(result.data[0]));
        } else {
          setColumns([]);
        }
      } catch (err) {
        console.error("Dataset preview error:", err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // ✅ Load when page or user changes
  useEffect(() => {
    if (!loadingUser) {
      loadPage(currentPage);
    }
  }, [currentPage, user, loadingUser, loadPage]);

  // ✅ Reload when dataset is updated (user or admin)
  useEffect(() => {
    const refresh = () => {
      setCurrentPage(1);
      loadPage(1);
    };

    window.addEventListener("dataset-updated", refresh);
    return () => window.removeEventListener("dataset-updated", refresh);
  }, [loadPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  if (loadingUser || loading) {
    return <p className="text-muted p-6">Loading dataset...</p>;
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 px-2 sm:px-4">
      {/* ✅ HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-accent">
          Dataset Preview
        </h1>

        <Link href="/" className="text-sm underline text-muted">
          ← Back
        </Link>
      </div>

      <p className="text-sm text-muted">
        <span className="font-semibold text-foreground">Dataset:</span>{" "}
        {datasetName}
      </p>

      <p className="text-xs sm:text-sm text-muted">
        Showing <b>{LIMIT}</b> rows per page • Total rows: <b>{totalRows}</b>
      </p>

      {/* ✅ TABLE SECTION */}
      <div className="flex-1 border border-border rounded-xl glass overflow-hidden">
        <div className="w-full h-full overflow-x-auto overflow-y-auto">
          <table className="min-w-max w-full text-[11px] sm:text-xs">
            <thead className="sticky top-0 bg-card z-10">
              <tr>
                <th className="px-3 py-2 border-b border-border">#</th>

                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 border-b border-border whitespace-nowrap max-w-[180px] truncate"
                    title={col}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-accent/10"
                >
                  <td className="px-3 py-1 text-muted font-medium">
                    {(currentPage - 1) * LIMIT + index + 1}
                  </td>

                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-1 text-muted whitespace-nowrap max-w-[200px] truncate"
                      title={row[col]?.toString() ?? "-"}
                    >
                      {row[col]?.toString() ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center py-4 text-muted text-sm"
                  >
                    No data found for this dataset.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ PAGINATION */}
      {pageCount > 1 && (
        <div className="flex justify-center pt-2 pb-2">
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={pageCount}
            forcePage={currentPage - 1}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName="flex flex-wrap gap-2 justify-center text-sm max-w-full"
            pageClassName="
              px-3 py-1
              border border-border rounded-md
              cursor-pointer
              hover:bg-accent/20
            "
            previousClassName="
              px-3 py-1
              border border-border rounded-md
              cursor-pointer
            "
            nextClassName="
              px-3 py-1
              border border-border rounded-md
              cursor-pointer
            "
            breakClassName="px-2 pointer-events-none"
            activeClassName="bg-accent text-primary-foreground font-bold"
          />
        </div>
      )}
    </div>
  );
}
