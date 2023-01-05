import React, { useState } from "react";
import { useEffect } from "react";

function FileUpload({ setFileBase }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  const fileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  };

  const onUploadFileChange = ({ target }) => {
    if (target.files < 1 || !target.validity.valid) {
      return;
    }
    fileToBase64(target.files[0], (err, result) => {
      if (result) {
        setFile(result);
        setFileName(target.files[0]);
      }
    });
  };
  useEffect(() => {
    console.log("loggin file name", fileName?.name);
    if (fileName) {
      localStorage.setItem("fileName", fileName?.name);
    }
  }, [fileName]);

  useEffect(() => {
    setFileBase(file);
  }, [file]);

  return (
    <div>
      <input
        type="file"
        name="filetobase64"
        onChange={onUploadFileChange}
        accept="application/docx"
      />
    </div>
  );
}

export default FileUpload;
