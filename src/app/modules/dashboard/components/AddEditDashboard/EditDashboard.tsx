import { useQuery } from "@tanstack/react-query";
import ApexCharts, { ApexOptions } from "apexcharts";
import moment from "moment";
import { useRef, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { KTIcon } from "../../../../../_metronic/helpers";
import { getHistoryList } from "../../../histories/api/HistoryAPI";
import { getThingChannelList } from "../../../things/api/ThingChannelAPI";
import { getDashboard } from "../../api/DashboardAPI";
import { WidgetDrawer } from "./Widget/WidgetDrawer";
import { EditSensor } from "./EditSensor";

const EditDashboard = () => {
  const params = useParams();
  const id = params.id as string;
  const chartRef = useRef<HTMLDivElement | null>(null);

  const [dashboardData, setDashboardData] = useState<any>([]);

  const dashboardQuery = useQuery({
    queryKey: [`dashboard`, id],
    queryFn: async () => getDashboard(id).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const dashboard = dashboardQuery.data;

  const refreshChart = async (data: any) => {
    setDashboardData(data);
    if (!chartRef.current) {
      return;
    }

    const filterGroupChannel = {
      offset: 0,
      limit: 100,
      name: "",
      status: "enabled",
    };

    const channelList: any = [];
    for (const device of data.devices) {
      const channelListByThingId = await getThingChannelList(device.id, filterGroupChannel);
      if (channelListByThingId.groups) {
        const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
          ...group,
          thingId: device.id,
        }));
        channelList.push(...groupsWithThingId);
      }
    }

    // Set the current time for from and to
    const fromTime = moment.utc(moment().subtract(data.duration, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000;
    const toTime = moment.utc(moment().format("YYYY-MM-DD")).startOf("day").valueOf() * 1000;

    const allHistoryData = [];
    const filterDevice = {
      limit: 100,
      offset: 0,
      thingId: [],
      status: "enabled",
      name: data.sensorType,
      from: fromTime,
      to: toTime,
      publisher: "",
    };

    for (const channel of channelList) {
      const filterWithPublisher = { ...filterDevice, publisher: channel.thingId };
      try {
        const historyData = await getHistoryList(channel.id, filterWithPublisher);
        if (historyData.messages) {
          allHistoryData.push(...historyData.messages);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    // Call getChartOptions function
    const chart = new ApexCharts(chartRef.current, getChartOptions(data.layout, data.sensorType, data.duration, data.devices, allHistoryData));
    if (chart) {
      chart.render();
    }
    return chart;
  };

  return (
    <>
      <div className="card-header d-flex justify-content-between py-6 px-9">
        <div className="card-title"></div>
        <div className="card-toolbar">
          <button type="button" className="btn btn-light mx-2" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          <button id="kt_widget_toggle" type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-dismiss="click" data-bs-trigger="hover">
            <KTIcon iconName="plus" className="fs-2" />
            Add New Widget
          </button>
        </div>
      </div>
      <div className="card-body py-0 px-9">
        <div className="accordion" id="kt_dashboard">
          <div className="accordion-item">
            <h2 className="accordion-header" id="kt_dashboard_information">
              <button
                className="accordion-button fs-4 fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#kt_accordion_1_body_1"
                aria-expanded="true"
                aria-controls="kt_accordion_1_body_1"
              >
                Dashboard Information
              </button>
            </h2>
            <div id="kt_accordion_1_body_1" className="accordion-collapse collapse show" aria-labelledby="kt_dashboard_information" data-bs-parent="#kt_dashboard">
              <div className="accordion-body">
                <Table responsive bordered>
                  <tbody>
                    <tr>
                      <td>
                        <label className="fw-bold fs-6">Name</label>
                      </td>
                      <td>{dashboard?.name}</td>
                    </tr>
                    <tr>
                      <td>
                        <label className="fw-bold fs-6">ID</label>
                      </td>
                      <td>{dashboard?.id}</td>
                    </tr>
                    <tr>
                      <td>
                        <label className="fw-bold fs-6">Description</label>
                      </td>
                      <td>{dashboard?.description}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="kt_widgets">
              <button
                className="accordion-button fs-4 fw-semibold collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#kt_widgets_body"
                aria-expanded="false"
                aria-controls="kt_widgets_body"
              >
                Widgets
              </button>
            </h2>
            <div id="kt_widgets_body" className="accordion-collapse collapse" aria-labelledby="kt_widgets" data-bs-parent="#kt_dashboard">
              <div className="accordion-body"></div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="kt_preview">
              <button
                className="accordion-button fs-4 fw-semibold collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#kt_preview_body"
                aria-expanded="false"
                aria-controls="kt_preview_body"
              >
                Preview
              </button>
            </h2>
            <div id="kt_preview_body" className="accordion-collapse collapse" aria-labelledby="kt_preview" data-bs-parent="#kt_dashboard">
              <div className="accordion-body">
                <div ref={chartRef} id="kt_charts_widget" style={{ height: "300px", width: "500px" }} />
                <EditSensor dashboardData={dashboardData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <WidgetDrawer onGetPreviewWidget={(data) => refreshChart(data)} />
    </>
  );
};

export { EditDashboard };

// final code for getChartOptions function
function getChartOptions(layout: any, sensorType: string, duration: number, deviceData: any, messages: any): ApexOptions {
  const categories: any = [];
  for (let i = duration - 1; i >= 0; i--) {
    categories.push({
      timeInFromTimestamp: moment.utc(moment().subtract(i, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000,
      timeInToTimestamp: moment.utc(moment().subtract(i, "days").format("YYYY-MM-DD")).endOf("day").valueOf() * 1000,
      timeInDisplay: moment().subtract(i, "days").format("DD/MM"),
    });
  }

  const series: any = [];
  deviceData.map((device: any) => {
    const categoryData: any = [];
    categories.map((category: any) => {
      // Filter messages per device and category (day)
      const data = messages.filter((message: any) => message.publisher === device.id && message.time > category.timeInFromTimestamp && message.time < category.timeInToTimestamp);

      // For histogram, we use the count of messages
      categoryData.push(data.length || 0);
    });

    series.push({
      name: device.name,
      data: categoryData,
    });
  });
  console.log("series", series);

  // Chart Options for different layouts
  if (layout === "pie" || layout === "donut") {
    return {
      series: series.map((serie: any) => serie.data.reduce((a: any, b: any) => a + b, 0)),
      chart: {
        height: 300,
        type: layout,
      },
      dataLabels: {
        enabled: false,
      },
      labels: deviceData.map((device: any) => device.name),
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "histogram") {
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      yaxis: {
        title: {
          text: sensorType,
        },
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "radialBar") {
    return {
      series: series.map((serie: any) => serie.data.reduce((a: any, b: any) => a + b, 0)),
      chart: {
        height: 300,
        type: layout,
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            total: {
              show: true,
              label: "Total",
            },
          },
        },
      },
      labels: deviceData.map((device: any) => device.name),
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "scatter") {
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "heatmap") {
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              { from: 0, to: 25, color: "#00A100" },
              { from: 26, to: 50, color: "#128FD9" },
              { from: 51, to: 75, color: "#FFB200" },
              { from: 76, to: 100, color: "#FF0000" },
            ],
          },
        },
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      dataLabels: {
        enabled: false,
      },
    };
  } else if (layout === "radar") {
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
      },
      labels: deviceData.map((device: any) => device.name),
      dataLabels: {
        enabled: false,
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "polarArea") {
    const seriesData = series.map((serie: any) => {
      // Ensure that we sum up valid numerical data for each device
      return serie.data.reduce((a: number, b: number) => a + (b || 0), 0);
    });

    return {
      series: seriesData, // Pass the summed up data
      chart: {
        height: 300,
        type: layout,
      },
      labels: deviceData.map((device: any) => device.name),
      dataLabels: {
        enabled: false,
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
      fill: {
        opacity: 0.8,
      },
      stroke: {
        width: 1,
      },
    };
  } else if (layout === "treemap") {
    return {
      series: [
        {
          data: deviceData.map((device: any) => ({
            x: device.name,
            y: series.find((serie: any) => serie.name === device.name)?.data.reduce((a: any, b: any) => a + b, 0),
          })),
        },
      ],
      chart: {
        height: 300,
        type: layout,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "rangeBar") {
    return {
      series: deviceData.map((device: any) => ({
        name: device.name,
        data: categories.map((category: any, index: number) => {
          const value = series.find((serie: any) => serie.name === device.name)?.data[index];
          return {
            x: category.timeInDisplay,
            y: value === 0 ? [0, 0] : [value - 5, value + 5],
          };
        }),
      })),
      chart: {
        height: 300,
        type: layout,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "candlestick") {
    return {
      series: deviceData.map((device: any) => ({
        name: device.name,
        data: categories.map((category: any, index: number) => {
          const value = series.find((serie: any) => serie.name === device.name)?.data[index];
          return {
            x: category.timeInDisplay,
            y: value === 0 ? [0, 0, 0, 0] : [value - 5, value + 5, value - 2, value + 2],
          };
        }),
      })),
      chart: {
        height: 300,
        type: layout,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "boxPlot") {
    return {
      series: deviceData.map((device: any) => ({
        name: device.name,
        data: categories.map((category: any, index: number) => {
          const value = series.find((serie: any) => serie.name === device.name)?.data[index];
          return {
            x: category.timeInDisplay,
            y: value === 0 ? [0, 0, 0, 0, 0] : [value - 10, value + 10, value - 5, value + 5, value],
          };
        }),
      })),
      chart: {
        height: 300,
        type: layout,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else if (layout === "bubble") {
    return {
      series: deviceData.map((device: any) => ({
        name: device.name,
        data: categories.map((category: any, index: number) => {
          const value = series.find((serie: any) => serie.name === device.name)?.data[index];
          return {
            x: category.timeInDisplay,
            y: value,
            z: value * 2,
          };
        }),
      })),
      chart: {
        height: 300,
        type: layout,
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  } else {
    // Default chart type (for other types like line, area, etc.)
    return {
      series: series,
      chart: {
        height: 300,
        type: layout,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: categories.map((category: any) => category.timeInDisplay),
      },
      colors: ["#F97E1C", "#F9B32A", "#F9C63E", "#F9D94C", "#F9E75A", "#F9F068", "#FAF576", "#FAF884", "#FBF993", "#FBFAA2"],
    };
  }
}
