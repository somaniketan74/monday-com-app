import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Documents from "../Pages/Documents";
import Setting from "../Pages/Setting";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { BASE_URL } from "../config";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export default function CenteredTabs() {
  const [value, setValue] = React.useState(1);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [context, setContext] = React.useState();
  const [reload, setReload] = React.useState(false);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverOpen2 = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handlePopoverClose2 = () => {
    setAnchorE2(null);
  };

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);

  let initialdata = [
    ["Item", "Qty", "Amount", "Total"],
    ["Shirt", "5", "100", "100"],
    ["Trowser", "7", "200", "600"],
  ];
  const [arryData, setArryData] = React.useState();

  const handleAPI = () => {
    let data = {
      userId: localStorage.getItem("userId"),
      data: arryData?.length > 0 ? arryData : initialdata,
    };
    let fetchRes = fetch(BASE_URL + "/document", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    fetchRes
      .then((res) => res.json())
      .then((d) => {
        console.log("List of generated documents", d.docs);
      });
  };

  const handleSubmitButton = async () => {
    const res = await monday.api(`query {
        boards(ids:[${localStorage.getItem("boardId")}]){
        columns{
          title,
          type
        },
        items(page:1, limit:10){
            column_values{
            title,
            value
          }
        }
      }
    }`);
    let data = [];
    let ignoreColumn = new Set(["name", "subtasks", "formula"]);
    let availableColumnName = new Set();
    console.log(res);
    if (res?.data?.boards) {
      let columns = res.data.boards[0]?.columns;
      let items = res.data.boards[0]?.items;
      let columnValue = [];
      columns.forEach((c) => {
        if (!ignoreColumn.has(c.type)) {
          availableColumnName.add(c.title);
          columnValue.push(c.title);
        }
      });
      data.push(columnValue);
      items.forEach((row) => {
        let rowValue = [];
        row.column_values.forEach((column) => {
          if (availableColumnName.has(column.title)) {
            rowValue.push(column.value);
          }
        });
        data.push(rowValue);
      });
    }
    //setArryData(data);
    let finalData = {
        userId: localStorage.getItem("userId"),
        data: data,
    };
    let fetchRes = fetch(BASE_URL + "/document", {
    method: "POST",
    body: JSON.stringify(finalData),
    headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    fetchRes
        .then((res) => res.json())
        .then((d) => {
          console.log("List of generated documents", d.docs);
          setReload(!reload);
        });
    console.log("getting call", finalData);
  };

  React.useEffect(() => {
    //handleAPI();
  }, [arryData]);

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "background.paper", mt: "5px" }}>
        <Tabs centered>
          <Tab
            label="Generate Document"
            sx={{
              textTransform: "capitalize",
              background: "rgb(28 192 36)",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              borderRadius: "10px",
              marginRight: "40px",
            }}
            onClick={() => handleSubmitButton()}
          />
          <Tab
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
              fontSize: "17px",
              color: "black",
              borderBottom: value === 1 && "2px solid blue",
              marginRight: "40px",
            }}
            label="Documents"
            onClick={() => {
              setValue(1);
            }}
            aria-owns={open ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
          <Tab
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
              fontSize: "17px",
              color: "black",
              borderBottom: value === 2 && "2px solid blue",
            }}
            label="Settings"
            onClick={() => {
              setValue(2);
            }}
            aria-owns={open2 ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen2}
            onMouseLeave={handlePopoverClose2}
          />
        </Tabs>

        <div
          style={{
            width: "90%",
            marginTop: "40px",
            marginLeft: "5%",
          }}
        >
          {value === 1 && <Documents  reload={reload}/>}
          {value === 2 && <Setting />}
        </div>
      </Box>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={value === 1 ? open : open2}
        anchorEl={value === 1 ? anchorEl : anchorE2}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={value === 1 ? handlePopoverClose : handlePopoverClose2}
        disableRestoreFocus
      >
        {value === 1 && (
          <Typography sx={{ p: 1, backgroundColor: "black", color: "white" }}>
            All your generated documents in one place
          </Typography>
        )}
        {value === 2 && (
          <Typography sx={{ p: 1, backgroundColor: "black", color: "white" }}>
            <p
              style={{
                marginBottom: "-10px",
              }}
            >
              Default name for generated documents.{" "}
            </p>
            <p
              style={{
                textAlign: "center",
              }}
            >
              {" "}
              You can use dynamic placeholder!
            </p>
          </Typography>
        )}
      </Popover>
    </>
  );
}
