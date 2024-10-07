import { useState } from "react";

interface IMetadataInputFields {
  metadata: any;
  setMetadata: (metadata: any) => void;
}

const MetadataInputFields = ({ metadata, setMetadata }: IMetadataInputFields) => {
  const [inputs, setInputs] = useState(convertObjectToArray(metadata));

  const handleAddInput = () => {
    setInputs([...inputs, { key: "", value: "" }]);
  };

  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;
    const onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
    setMetadata(convertArrayToObject(onChangeValue));
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
    setMetadata(convertArrayToObject(newArray));
  };

  return (
    <div>
      {inputs.map((item: any, index: number) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-5">
            <input name="key" type="text" placeholder="Key" className="form-control" value={item.key} onChange={(event) => handleChange(event, index)} />
          </div>
          <div className="col-md-5">
            <input name="value" type="text" placeholder="Value" className="form-control" value={item.value} onChange={(event) => handleChange(event, index)} />
          </div>
          <div className="col-md-2 d-flex align-items-center">
            {inputs.length > 0 && (
              <button type="button" className="btn btn-sm btn-light-danger" onClick={() => handleDeleteInput(index)}>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="row">
        <div className="col-md-12">
          <button type="button" className="btn btn-sm btn-light-primary" onClick={() => handleAddInput()}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const convertObjectToArray = (metadata: any) => {
  const metadataArray = [];
  for (const key in metadata) {
    metadataArray.push({ key: key, value: metadata[key] });
  }
  return metadataArray;
};

const convertArrayToObject = (metadata: any) => {
  const metadataObject: any = {};
  metadata.forEach((item: any) => {
    metadataObject[item.key] = item.value;
  });
  return metadataObject;
};

export { MetadataInputFields };
