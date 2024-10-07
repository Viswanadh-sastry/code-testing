import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { Typeahead } from "react-bootstrap-typeahead";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { getThingList } from "../../../../things/api/ThingAPI";

interface IAddChartProps {
  selectedWidget: any;
  onCloseAddChart: () => void;
  onGetChartList: () => void;
  isActivated: any;
  onGetPreviewWidgetList: (data: any) => void;
}

const CreateView = ({ selectedWidget, onCloseAddChart, onGetChartList, onGetPreviewWidgetList }: IAddChartProps) => {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const filterDevice = {
    limit: 100,
    offset: 0,
    status: "enabled",
  };
  const deviceListQuery = useQuery({
    queryKey: [`deviceList`, filterDevice],
    queryFn: async () => getThingList(filterDevice).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const deviceList = deviceListQuery.data?.things.map((thing: any) => ({ label: thing.name, value: thing.id })) || [];
  // Extract and flatten the tags, then remove duplicates
  const uniqueTags = Array.from(
    new Set(
      (deviceListQuery.data?.things.flatMap((thing: any) => thing.tags as string[]) || [])
        .filter((tag: string | undefined) => tag) // Filter out undefined, null, or empty tags
        .map((tag: string) => tag.trim()) // Normalize tags by trimming and converting to lowercase
    )
  ).map((tag) => ({ label: tag }));
  console.log("uniqueTags", uniqueTags);

  const chartSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    devices: Yup.array().min(1, "Device is required"),
    duration: Yup.number(),
    fromDate: Yup.date(),
    toDate: Yup.date(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      devices: [],
      duration: 1,
      fromDate: null,
      toDate: null,
    },
    validationSchema: chartSchema,
    onSubmit: async (values) => {
      onGetChartList();
      const data = {
        name: values.name,
        description: values.description,
        devices: values.devices.map((device: any) => ({
          name: device.label,
          sensorType: device.sensorType,
        })),
        duration: values.duration,
        fromDate: values.fromDate,
        toDate: values.toDate,
      };
      onGetPreviewWidgetList(data);
      onCloseAddChart();
      //   createChart(values)
      //     .then(() => {
      //       toast.success("Chart created successfully");
      //       onCloseAddChart();
      //       onGetChartList();
      //     })
      //     .catch((error) => toast.error(error.message))
      //     .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_chart" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add New Widget</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-chart-modal-action="close" onClick={onCloseAddChart} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_chart_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Name</label>
                        <input
                          {...formik.getFieldProps("name")}
                          type="text"
                          name="name"
                          placeholder="Widget Name"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.name && formik.errors.name },
                            { "is-valid": formik.touched.name && !formik.errors.name }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Description</label>
                        <input
                          {...formik.getFieldProps("description")}
                          type="text"
                          name="description"
                          placeholder="Widget Description"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.description && formik.errors.description },
                            { "is-valid": formik.touched.description && !formik.errors.description }
                          )}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Device</label>
                        <Typeahead
                          id="devices"
                          {...formik.getFieldProps("devices")}
                          multiple
                          labelKey="label"
                          options={deviceList}
                          selected={formik.values.devices}
                          onChange={(selected: any) => formik.setFieldValue("devices", selected)}
                          placeholder="Select Device"
                        />
                        {formik.touched.devices && formik.errors.devices && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.devices}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Duration</label>
                        <select {...formik.getFieldProps("duration")} className="form-select form-select form-select-lg fw-bold" name="duration">
                          <option value="">Select Duration</option>
                          <option value="7">7 days</option>
                          <option value="15">15 days</option>
                          <option value="30">30 days</option>
                          <option value="90">3 months</option>
                          <option value="180">6 months</option>
                          <option value="360">1 year</option>
                        </select>
                        {formik.touched.duration && formik.errors.duration && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.duration}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Layout: {selectedWidget?.name}</label>
                        <div className="overlay me-7">
                          <div className="overlay-wrapper">
                            <img alt="img" className="rounded w-200px" src={toAbsoluteUrl(selectedWidget?.imageUrl)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddChart} className="btn btn-light me-3" data-kt-chart-modal-action="cancel" disabled={formik.isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <span className="indicator-label">Submit</span>
                  </button>
                </div>
                {/* end::Actions */}
              </form>
            </div>
            {/* end::Modal body */}
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { CreateView };
