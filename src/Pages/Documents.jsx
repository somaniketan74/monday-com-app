import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import OIP from "../Assets/OIP.png";
import { BASE_URL } from "../config";

export default function BasicTable({ reload}) {
  const [listOfDocuments, setListOfDocuments] = React.useState();
  React.useEffect(() => {
    let fetchRes = fetch(BASE_URL + `/document?userId=${localStorage.getItem("userId")}`);
    fetchRes
      .then((res) => res.json())
      .then((d) => {
        console.log("List of documents", d.docs);
        setListOfDocuments(d.docs);
      });
  }, [reload]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxHeight: 650 }} aria-label="simple table">
        <TableHead
          style={{
            backgroundColor: "#f4f4f4",
            borderBottom: "1.02px solid black",
          }}
        >
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Document Name
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfDocuments?.map((row, index) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                <a href={row.url}>
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                      marginBottom: "-10px",
                      marginRight: "10px",
                    }}
                    src={OIP}
                  />
                  {row.fileName}
                  {/* {row.document_name} */}
                </a>
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {new Date(row.createdAt).toLocaleString("en-gb", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
