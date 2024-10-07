import ApexCharts, { ApexOptions } from "apexcharts";
import moment from "moment";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Rnd } from "react-rnd";
import { KTCard, KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { getHistoryList } from "../../../histories/api/HistoryAPI";
import { getThingChannelList } from "../../../things/api/ThingChannelAPI";
import { WidgetDrawer } from "./Widget/WidgetDrawer";
import { getChannelThingList } from "../../../channels/api/ChannelThingAPI";

const LayoutBuilder = () => {
  const params = useParams();
  const id = params.id as string;
  console.log("id", id);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const layoutData = {
    height: 400,
    width: 500,
    left: 0,
    top: 0,
    order: 0,
    title: "",
    name: "",
    imageUrl: "",
  };
  const [selectedLayout, setSelectedLayout] = useState<any>(layoutData);
  const style = {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
  };

  const refreshChart = async (data: any) => {
    console.log("data", data);
    if (!chartRef.current) return;

    const filterGroupChannel = {
      offset: 0,
      limit: 100,
      name: "",
      status: "enabled",
    };

    const deviceList: any = [];
    for (const device of data.devices) {
      if (device.deviceLabel === "thing") {
        const channelListByThingId = await getThingChannelList(device.deviceValue, filterGroupChannel);
        if (channelListByThingId.groups) {
          const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
            channelId: group.id,
            thingName: device.deviceName,
            thingId: device.deviceValue,
          }));
          if (groupsWithThingId.length > 0) {
            deviceList.push(groupsWithThingId[0]);
          }
        }
      } else {
        const channelListByGroupId = await getChannelThingList(device.deviceValue, filterGroupChannel);
        if (channelListByGroupId.things) {
          const groupsWithChannelId = channelListByGroupId.things.map((thing: any) => ({
            channelId: device.deviceValue,
            thingName: thing.name,
            thingId: thing.id,
          }));
          deviceList.push(...groupsWithChannelId);
        }
      }
    }

    // Set the current time for from and to
    const fromTime = moment.utc(moment().subtract(data.timeline, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000;
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

    for (const device of deviceList) {
      const filterWithPublisher = { ...filterDevice, publisher: device.thingId };
      try {
        const historyData = await getHistoryList(device.channelId, filterWithPublisher);
        if (historyData.messages) {
          allHistoryData.push(...historyData.messages);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    // Call getChartOptions function
    const chart = new ApexCharts(chartRef.current, getChartOptions(data.layout, data.sensorType, data.timeline, deviceList, allHistoryData));
    if (chart) {
      chart.render();
      setSelectedLayout({
        ...selectedLayout,
        title: data.name,
      });
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
      <KTCard className="h-1000px">
        <KTCardBody className="py-4">
          <Rnd
            bounds="parent"
            style={style}
            className="d-flex flex-column align-items-center justify-content-center"
            default={{ x: selectedLayout.left, y: selectedLayout.top, width: selectedLayout.width, height: selectedLayout.height }}
            size={{ width: selectedLayout.width, height: selectedLayout.height }}
            position={{ x: selectedLayout.left, y: selectedLayout.top }}
            onDragStop={(e, d) => {
              setSelectedLayout({
                ...selectedLayout,
                left: d.x,
                top: d.y,
              });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setSelectedLayout({
                ...selectedLayout,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                left: position.x,
                top: position.y,
              });
            }}
          >
            {selectedLayout.title}
            <div
              ref={chartRef}
              id="kt_charts_widget"
              style={{
                height: `${selectedLayout.height - 85}px`, // Deducting some space for padding/margins if needed
                width: `${selectedLayout.width - 40}px`,
              }}
            ></div>
          </Rnd>
        </KTCardBody>
      </KTCard>
      <WidgetDrawer selectedLayout={selectedLayout} setSelectedLayout={setSelectedLayout} onGetPreviewWidget={(data) => refreshChart(data)} />
    </>
  );
};

export { LayoutBuilder };

// final code for getChartOptions function
function getChartOptions(layout: any, sensorType: string, timeline: number, deviceData: any, messages: any): ApexOptions {
  const categories: any = [];
  for (let i = timeline - 1; i >= 0; i--) {
    categories.push({
      timeInFromTimestamp: moment.utc(moment().subtract(i, "days").format("YYYY-MM-DD")).startOf("day").valueOf() * 1000,
      timeInToTimestamp: moment.utc(moment().subtract(i, "days").format("YYYY-MM-DD")).endOf("day").valueOf() * 1000,
      timeInDisplay: moment().subtract(i, "days").format("DD/MM"),
    });
  }
  console.log("categories", categories);

  const series: any = [];
  deviceData.map((device: any) => {
    const categoryData: any = [];
    categories.map((category: any) => {
      // Filter messages per device and category (day)
      const data = messages.filter(
        (message: any) => message.publisher === device.thingId && message.time > category.timeInFromTimestamp && message.time < category.timeInToTimestamp
      );

      // For histogram, we use the count of messages
      categoryData.push(data.length || 0);
    });

    series.push({
      name: device.thingName,
      data: categoryData,
    });
  });
  console.log("deviceData", deviceData);
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
    console.log("series ---> ", series);
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
