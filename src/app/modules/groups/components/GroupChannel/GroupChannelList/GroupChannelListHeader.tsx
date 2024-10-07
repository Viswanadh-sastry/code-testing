// import { KTIcon } from "../../../../../../_metronic/helpers";

// interface IGroupsChannelListHeaderProps {
//   onShowAddGroupChannel: () => void;
// }

const GroupChannelListHeader = () => {
  return (
    <>
      <div className="card-header border-0 pt-6">
        <div className="card-title"></div>

        <div className="card-toolbar">
          <button type="button" className="btn btn-light" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          {/* <div className="d-flex justify-content-end" data-kt-group-table-toolbar="base">
            <button type="button" className="btn btn-primary" onClick={onShowAddGroupChannel}>
              <KTIcon iconName="plus" className="fs-2" />
              Add Asset
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export { GroupChannelListHeader };
