import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIxNjcxODMyOSwidWlkIjozNzczMzgyNCwiaWFkIjoiMjAyMy0wMS0wNFQxMDoxNjozOC44MDhaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQ2MzU1MTgsInJnbiI6InVzZTEifQ.c8uB-YDoRVegMWLlFmBwaOO55NFjzFC2m4XpzcbJZbA");

const App = () => {
  const [context, setContext] = useState();
  const [userId, setUserId] = useState("");
  const [boardId, setBoardId] = useState("");

  const handleSubmitButton = async () => { 
    const res = await monday.api(`query {
        boards(ids:[${context.boardId}]){
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
    }`)
    let data = [];
    let ignoreColumn = new Set(["name", "subtasks", "formula"]);
    let availableColumnName = new Set();
    console.log(res);
    if(res?.data?.boards){
        let columns = res.data.boards[0]?.columns;
        let items = res.data.boards[0]?.items;
        let columnValue = [];
        columns.forEach((c) => {
            if(!ignoreColumn.has(c.type)){
                availableColumnName.add(c.title);
                columnValue.push(c.title);
            }
        });
        data.push(columnValue);
        items.forEach((row) => {
            let rowValue = [];
            row.column_values.forEach((column) => {
                if(availableColumnName.has(column.title)){
                    rowValue.push(column.value);
                }
            });
            data.push(rowValue);
        })
    }
    console.log(data);
  }; 

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
      setUserId(res.data.user.id);
      setBoardId(res.data.boardId);
      console.log(`userId: ${res.data.user.id}`)
      console.log(`boardId: ${res.data.boardId}`)
    });
  }, []);

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${
    context ? context.user.id : "still loading"
  }.
  Let's start building your amazing app, which will change the world!`;

  return (
    <div className="App">
      <AttentionBox
        title="Hello Monday Apps!"
        text="Ready to start my app journey by building a view!"
        type="success"
      />

    <input type="submit" value="submit" onClick={handleSubmitButton} /> 
    </div>
  );
};

export default App;