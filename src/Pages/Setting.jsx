import { Card, Input } from "@mui/material";
import React from "react";
import Switch, { switchClasses } from "@mui/joy/Switch";
import { StyledEngineProvider, CssVarsProvider } from "@mui/joy/styles";
import FileUpload from "../Pages/FileUpload";
import { useEffect } from "react";
import { BASE_URL } from "../config";

function Setting() {
  const [checkedword, setCheckedword] = React.useState(false);
  const [checkedpdf, setCheckedpdf] = React.useState(false);

  const [fileName, setFileName] = React.useState(localStorage.getItem("defaultfileName")
  ? localStorage.getItem("defaultfileName")
  : "");

  const [fileBase, setFileBase] = React.useState("");

  useEffect(() => {
    if (fileBase?.length > 0) {
      localStorage.setItem(
        "defaultfileName",
        fileName === "" ? "Test" : fileName
      );
      let data = {
        userId: localStorage.getItem("userId"),
        file: fileBase?.split(",")[1],
        fileName: (fileName === "" ? "test" : fileName) + ".docx",
      };
      fetch(BASE_URL + `/template`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then((res) => res.json())
      .then((res) => {
        // Handle response
        console.log("Response: ", res?.template?.url);
        localStorage.setItem("fileurl", res?.template?.url);
      })
        .catch((err) => {
          // Handle error
          console.log("Error message: ", err);
        });
    }
  }, [fileBase]);

  return (
    <>
      <Card
        sx={{ backgroundColor: "#f4f4f4", height: "60vh", padding: "20px" }}
      >
        <h2>Document format</h2>
        <p
          style={{
            fontSize: "14px",
          }}
        >
          Default document name
        </p>

        <Input
          type="text"
          defaultValue="Test 1"
          style={{
            width: "90%",
          }}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <p
          style={{
            fontStyle: "italic",
          }}
        >
          You can use{" "}
          <span
            style={{
              textDecoration: "underline",
            }}
          >
            placeholder
          </span>{" "}
          to name your document dynamically.
        </p>
        <p
          style={{
            fontWeight: "600",
            display: "flex",
          }}
        >
          <span
            style={{
              marginRight: "10px",
            }}
          >
            {" "}
            Template:{" "}
          </span>
          <FileUpload setFileBase={setFileBase} />
        </p>
        {<a href={localStorage.getItem("fileurl")}>
            {localStorage.getItem("fileName")}
          </a>}
      </Card>
    </>
  );
}

export default Setting;
