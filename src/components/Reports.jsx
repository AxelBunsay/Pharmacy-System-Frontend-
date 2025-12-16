import React, { useState, useRef, useEffect, useCallback } from "react";
import { exportToCSV } from "../utils/csv";
import { ResponsiveLine } from "@nivo/line";
import {
  fetchReportsDaily,
  fetchReportsWeekly,
  fetchReportsMonthly,
  fetchReportsYearly,
  fetchReportsByRange,
} from "../api/reports";
import { getProducts } from "../api/products";

const formatCurrency = (amount) => {
  if (!amount) return "₱0.00";
  return `₱${parseFloat(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getExpiryStatus = (expiryDate) => {
  if (!expiryDate)
    return { status: "No Date", class: "bg-gray-100 text-gray-800" };

  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: "Expired", class: "bg-red-100 text-red-800" };
  } else if (diffDays <= 7) {
    return { status: "Expiring Soon", class: "bg-red-100 text-red-800" };
  } else if (diffDays <= 30) {
    return {
      status: "Expiring in 30d",
      class: "bg-yellow-100 text-yellow-800",
    };
  } else {
    return { status: "Good", class: "bg-green-100 text-green-800" };
  }
};

export default function Reports() {
  const [filter, setFilter] = useState("daily");
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [stockData, setStockData] = useState([]);
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [isStockLoadingMore, setIsStockLoadingMore] = useState(false);
  const [stockPage, setStockPage] = useState(1);
  const [hasMoreStock, setHasMoreStock] = useState(true);
  const [stockStats, setStockStats] = useState({
    outOfStock: 0,
    lowStock: 0,
    moderateStock: 0,
    goodStock: 0,
    expired: 0,
    expiringSoon: 0,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState([]);

  const salesObserver = useRef();
  const stockObserver = useRef();
  const salesPrintRef = useRef(null);

  const lastSalesItemRef = useCallback(
    (node) => {
      if (isLoading || isLoadingMore) return;
      if (salesObserver.current) salesObserver.current.disconnect();

      salesObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreSalesData();
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        },
      );

      if (node) salesObserver.current.observe(node);
    },
    [isLoading, isLoadingMore, hasMore],
  );

  const lastStockItemRef = useCallback(
    (node) => {
      if (isStockLoading || isStockLoadingMore) return;
      if (stockObserver.current) stockObserver.current.disconnect();

      stockObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreStock) {
            loadMoreStockData();
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        },
      );

      if (node) stockObserver.current.observe(node);
    },
    [isStockLoading, isStockLoadingMore, hasMoreStock],
  );

  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);

    fetchStockData(1, true);
  }, []);

  const fetchSalesData = async (pageNum = 1, reset = true) => {
    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let response;
      const today = new Date();

      switch (filter) {
        case "daily":
          response = await fetchReportsDaily(
            today.toISOString().split("T")[0],
            pageNum,
          );
          break;
        case "weekly":
          response = await fetchReportsWeekly(
            pageNum,
          );
          break;
        case "monthly":
          const month = today.getMonth() + 1;
          const year = today.getFullYear();
          response = await fetchReportsMonthly(month, year, pageNum);
          break;
        case "annual":
          response = await fetchReportsYearly(today.getFullYear(), pageNum);
          break;
        case "range":
          if (!startDate || !endDate) {
            alert("Please select both start and end dates");
            setIsLoading(false);
            setIsLoadingMore(false);
            return;
          }
          response = await fetchReportsByRange(startDate, endDate, pageNum);
          break;
        default:
          response = await fetchReportsDaily(
            today.toISOString().split("T")[0],
            pageNum,
          );
      }

      if (response) {
        setTotalSales(response.total_sales || 0);
        setTotalTransactions(response.total_transaction || 0);

        const newData = response.sales?.data || [];

        if (reset) {
          setSalesData(newData);
          generateChartDataFromSales(newData);
        } else {
          setSalesData((prev) => [...prev, ...newData]);
          generateChartDataFromSales([...salesData, ...newData]);
        }

        setHasMore(response.sales?.hasNextPage || false);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      if (reset) {
        alert("Error fetching sales data. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchStockData = async (pageNum = 1, reset = true) => {
    if (reset) {
      setIsStockLoading(true);
    } else {
      setIsStockLoadingMore(true);
    }

    try {
      const response = await getProducts(pageNum);

      if (response) {
        const newData = response.data || [];

        if (reset) {
          setStockData(newData);
        } else {
          setStockData((prev) => [...prev, ...newData]);
        }

        setHasMoreStock(response.next_page || false);
        setStockPage(pageNum);

        if (reset) {
          calculateStockStats(newData);
        } else {
          calculateStockStats([...stockData, ...newData]);
        }
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      if (reset) {
        alert("Error fetching stock data. Please try again.");
      }
    } finally {
      setIsStockLoading(false);
      setIsStockLoadingMore(false);
    }
  };

  const calculateStockStats = (products) => {
    const stats = {
      outOfStock: 0,
      lowStock: 0,
      moderateStock: 0,
      goodStock: 0,
      expired: 0,
      expiringSoon: 0,
    };

    products.forEach((product) => {
      if (product.stock <= 0) {
        stats.outOfStock++;
      } else if (product.stock <= 10) {
        stats.lowStock++;
      } else if (product.stock <= 30) {
        stats.moderateStock++;
      } else {
        stats.goodStock++;
      }

      if (product.expiry_date) {
        const today = new Date();
        const expiry = new Date(product.expiry_date);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          stats.expired++;
        } else if (diffDays <= 7) {
          stats.expiringSoon++;
        }
      }
    });

    setStockStats(stats);
  };

  const loadMoreSalesData = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      fetchSalesData(page + 1, false);
    }
  }, [page, hasMore, isLoading, isLoadingMore]);

  const loadMoreStockData = useCallback(() => {
    if (!isStockLoading && !isStockLoadingMore && hasMoreStock) {
      fetchStockData(stockPage + 1, false);
    }
  }, [stockPage, hasMoreStock, isStockLoading, isStockLoadingMore]);

  useEffect(() => {
    fetchSalesData(1, true);
  }, [filter]);

  useEffect(() => {
    setSalesData([]);
    setChartData([]);
    setPage(1);
    setHasMore(true);
  }, [filter]);

  const generateChartDataFromSales = (data) => {
    if (!data || data.length === 0) {
      // Return valid empty chart data structure
      setChartData([
        {
          id: "Sales",
          color: "hsl(205, 70%, 50%)",
          data: [],
        },
      ]);
      return;
    }

    const groupedData = {};

    data.forEach((sale) => {
      const date = new Date(sale.created_at);
      let key;

      switch (filter) {
        case "daily":
          key = `${date.getHours()}:00`;
          break;
        case "weekly":
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          key = days[date.getDay()];
          break;
        case "monthly":
          key = date.getDate();
          break;
        case "annual":
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          key = months[date.getMonth()];
          break;
        case "range":
          key = formatDate(date);
          break;
        default:
          key = date.toLocaleDateString();
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += parseFloat(sale.total_price || 0);
    });

    const dataPoints = Object.keys(groupedData).map((key) => ({
      x: key,
      y: groupedData[key],
    }));

    dataPoints.sort((a, b) => {
      if (filter === "daily") {
        const hourA = parseInt(a.x.split(":")[0]);
        const hourB = parseInt(b.x.split(":")[0]);
        return hourA - hourB;
      }
      if (filter === "monthly") {
        const dayA = parseInt(a.x);
        const dayB = parseInt(b.x);
        return dayA - dayB;
      }
      if (filter === "annual") {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return months.indexOf(a.x) - months.indexOf(b.x);
      }
      if (filter === "range") {
        const dateA = new Date(a.x.replace(/(\w+) (\d+), (\d+)/, "$1 $2, $3"));
        const dateB = new Date(b.x.replace(/(\w+) (\d+), (\d+)/, "$1 $2, $3"));
        return dateA - dateB;
      }
      return 0;
    });

    // Ensure we have valid data points
    const validDataPoints = dataPoints.filter(point => 
      !isNaN(point.y) && point.y !== null && point.y !== undefined
    );

    setChartData([
      {
        id: "Sales",
        color: "hsl(205, 70%, 50%)",
        data: validDataPoints,
      },
    ]);
  };

  const applyDateRangeFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date");
      return;
    }

    setFilter("range");
    fetchSalesData(1, true);
  };

  const resetDateRangeFilter = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    setFilter("daily");
    fetchSalesData(1, true);
  };

  const handlePrint = () => {
    const printContent = salesPrintRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const exportSalesToCSV = () => {
    if (!salesData || salesData.length === 0) {
      alert("No sales data to export");
      return;
    }

    const csvData = salesData.map((sale) => ({
      "Product Name": sale.product_name,
      SKU: sale.sku,
      Quantity: sale.quantity,
      "Unit Price": formatCurrency(sale.unit_price),
      "Total Price": formatCurrency(sale.total_price),
      Date: new Date(sale.created_at).toLocaleString(),
      Category: sale.category || "N/A",
    }));

    exportToCSV(`sales-report-${filter}.csv`, csvData);
  };

  const exportStockToCSV = () => {
    if (!stockData || stockData.length === 0) {
      alert("No stock data to export");
      return;
    }

    const csvData = stockData.map((product) => {
      const stockStatus = getStockStatus(product.stock);
      const expiryStatus = getExpiryStatus(product.expiry_date);

      return {
        "Product Name": product.name,
        SKU: product.sku,
        Category: product.category || "N/A",
        Stock: product.stock,
        "Stock Status": stockStatus.status,
        Price: formatCurrency(product.price),
        "Expiry Date": product.expiry_date
          ? formatDate(product.expiry_date)
          : "N/A",
        "Expiry Status": expiryStatus.status,
        "Last Updated": new Date(
          product.updated_at || product.created_at,
        ).toLocaleDateString(),
      };
    });

    exportToCSV("stock-health-report.csv", csvData);
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) {
      return { status: "Out of Stock", class: "bg-red-100 text-red-800" };
    } else if (stock <= 10) {
      return { status: "Low Stock", class: "bg-red-100 text-red-800" };
    } else if (stock <= 30) {
      return { status: "Moderate", class: "bg-yellow-100 text-yellow-800" };
    } else {
      return { status: "Good", class: "bg-green-100 text-green-800" };
    }
  };

  const getDateRangeLabel = () => {
    if (filter === "range") {
      return `${formatDate(startDate)} to ${formatDate(endDate)}`;
    }
    return filter.charAt(0).toUpperCase() + filter.slice(1);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 mt-16">Reports</h2>

      <div className="card mb-6">
        <h3 className="font-semibold text-lg">Inventory Export</h3>
        <p className="text-sm text-gray-500">
          Download current inventory snapshot as CSV.
        </p>
        <div className="mt-3">
          <button
            onClick={exportStockToCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Download Stock CSV
          </button>
        </div>
      </div>

      <div className="card mb-6" ref={salesPrintRef}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Sales Report</h3>
          <div className="flex gap-2 items-center">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border text-sm px-2 py-1 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition cursor-pointer"
              disabled={isLoading || isLoadingMore}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="range">Date Range</option>
            </select>

            {filter === "range" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border text-sm px-2 py-1 rounded-lg"
                  max={endDate}
                  disabled={isLoading || isLoadingMore}
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border text-sm px-2 py-1 rounded-lg"
                  min={startDate}
                  max={new Date().toISOString().split("T")[0]}
                  disabled={isLoading || isLoadingMore}
                />
                <button
                  onClick={applyDateRangeFilter}
                  disabled={
                    isLoading || isLoadingMore || !startDate || !endDate
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded transition disabled:opacity-50"
                >
                  Apply
                </button>
                <button
                  onClick={resetDateRangeFilter}
                  disabled={isLoading || isLoadingMore}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded transition disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            )}

            <button
              onClick={exportSalesToCSV}
              disabled={isLoading || isLoadingMore || salesData.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-1 text-sm rounded transition"
            >
              {isLoading ? "Loading..." : "Export CSV"}
            </button>

            <button
              onClick={handlePrint}
              disabled={isLoading || isLoadingMore}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded transition disabled:opacity-50"
            >
              Print
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Filter sales activity by time range. Scroll down to load more records.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-2xl font-bold">{totalTransactions}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Period</p>
            <p className="text-xl font-bold">{getDateRangeLabel()}</p>
          </div>
        </div>

        <div className="mt-2">
          <h4 className="font-semibold text-gray-700 mb-3">
            Showing: {getDateRangeLabel()} Sales Report
          </h4>

          {isLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-400 mt-2">Loading sales data...</p>
            </div>
          ) : salesData.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-400">
                No sales activity found for the selected period.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Try selecting a different date range.
              </p>
            </div>
          ) : (
            <>
              <div
                className="overflow-x-auto border rounded-lg"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesData.map((sale, index) => {
                      if (index === salesData.length - 1) {
                        return (
                          <tr
                            key={sale.id}
                            ref={lastSalesItemRef}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-sm">
                              {sale.product_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                              {sale.sku}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              {sale.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              {formatCurrency(sale.unit_price)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-right">
                              {formatCurrency(sale.total_price)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(sale.created_at).toLocaleDateString(
                                "en-PH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            {sale.product_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                            {sale.sku}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {sale.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {formatCurrency(sale.unit_price)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-right">
                            {formatCurrency(sale.total_price)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(sale.created_at).toLocaleDateString(
                              "en-PH",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {isLoadingMore && (
                <div className="text-center py-4 border-t">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-gray-400 text-sm mt-2">
                    Loading more records...
                  </p>
                </div>
              )}

              {!hasMore && salesData.length > 0 && (
                <div className="text-center py-3 border-t">
                  <p className="text-gray-500 text-sm">All records loaded.</p>
                  <p className="text-gray-400 text-xs">
                    Displaying {salesData.length} records
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div
          className="bg-white rounded shadow p-4 mt-6"
          style={{ height: 300 }}
        >
          <h3 className="text-lg font-semibold mb-2">
            {filter === "daily" && "Daily Sales"}
            {filter === "weekly" && "Weekly Sales"}
            {filter === "monthly" && "Monthly Sales"}
            {filter === "annual" && "Annual Sales"}
            {filter === "range" &&
              `Sales from ${formatDate(startDate)} to ${formatDate(endDate)}`}
          </h3>
          {chartData[0]?.data?.length > 0 ? (
            <ResponsiveLine
              data={chartData}
              margin={{ top: 30, right: 40, bottom: 50, left: 70 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
                reverse: false,
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: "bottom",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: filter === "annual" || filter === "range" ? 45 : 0,
                legend:
                  filter === "daily"
                    ? "Hour of Day"
                    : filter === "weekly"
                      ? "Day of Week"
                      : filter === "monthly"
                        ? "Day of Month"
                        : filter === "annual"
                          ? "Month"
                          : "Date",
                legendOffset: 40,
                legendPosition: "middle",
              }}
              axisLeft={{
                orient: "left",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Sales Amount (₱)",
                legendOffset: -60,
                legendPosition: "middle",
                format: (value) =>
                  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 0 })}`,
              }}
              colors={{ scheme: "set1" }}
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              useMesh={true}
              enableSlices="x"
              enableGridX={false}
              enableGridY={true}
              enableArea={true}
              areaOpacity={0.15}
              tooltip={({ point }) => (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                  <div className="font-semibold text-sm">
                    {point.data.xFormatted}
                  </div>
                  <div className="text-blue-600 font-bold">
                    {formatCurrency(point.data.y)}
                  </div>
                </div>
              )}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-center">
                No chart data available for the selected period
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Stock Health Report</h3>
          <button
            onClick={exportStockToCSV}
            disabled={
              isStockLoading || isStockLoadingMore || stockData.length === 0
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-1 text-sm rounded transition"
          >
            {isStockLoading ? "Loading..." : "Export CSV"}
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Overall stock status of all products. Scroll down to load more.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
          <div className="bg-red-50 p-3 rounded">
            <p className="text-xs text-gray-600">Out of Stock</p>
            <p className="text-xl font-bold text-red-600">
              {stockStats.outOfStock}
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <p className="text-xs text-gray-600">Low Stock</p>
            <p className="text-xl font-bold text-orange-600">
              {stockStats.lowStock}
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-xs text-gray-600">Moderate</p>
            <p className="text-xl font-bold text-yellow-600">
              {stockStats.moderateStock}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-xs text-gray-600">Good Stock</p>
            <p className="text-xl font-bold text-green-600">
              {stockStats.goodStock}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <p className="text-xs text-gray-600">Expired</p>
            <p className="text-xl font-bold text-red-600">
              {stockStats.expired}
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-xs text-gray-600">Expiring Soon</p>
            <p className="text-xl font-bold text-yellow-600">
              {stockStats.expiringSoon}
            </p>
          </div>
        </div>

        {isStockLoading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-400 mt-2">Loading stock data...</p>
          </div>
        ) : stockData.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-400">No stock data found.</p>
          </div>
        ) : (
          <>
            <div
              className="overflow-x-auto border rounded-lg"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockData.map((product, index) => {
                    const stockStatus = getStockStatus(product.stock);
                    const expiryStatus = getExpiryStatus(product.expiry_date);

                    if (index === stockData.length - 1) {
                      return (
                        <tr
                          key={product.id}
                          ref={lastStockItemRef}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                            {product.sku}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {product.category || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {product.stock}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.class}`}
                            >
                              {stockStatus.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 text-center">
                            {product.expiry_date
                              ? formatDate(product.expiry_date)
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${expiryStatus.class}`}
                            >
                              {expiryStatus.status}
                            </span>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.category || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {product.stock}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.class}`}
                          >
                            {stockStatus.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center">
                          {product.expiry_date
                            ? formatDate(product.expiry_date)
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${expiryStatus.class}`}
                          >
                            {expiryStatus.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {isStockLoadingMore && (
              <div className="text-center py-4 border-t">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-gray-400 text-sm mt-2">
                  Loading more products...
                </p>
              </div>
            )}

            {!hasMoreStock && stockData.length > 0 && (
              <div className="text-center py-3 border-t">
                <p className="text-gray-500 text-sm">All products loaded.</p>
                <p className="text-gray-400 text-xs">
                  Displaying {stockData.length} products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}