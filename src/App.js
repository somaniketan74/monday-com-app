import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import LandingPage from "./LandingPage/LandingPage";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();
//monday.setToken("###");

const App = () => {
  const [context, setContext] = useState();
  const [userId, setUserId] = useState("");
  const [boardId, setBoardId] = useState("");




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
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("boardId", res.data.boardId);
    });
  }, []);

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${context ? context.user.id : "still loading"
    }.
  Let's start building your amazing app, which will change the world!`;

  return (
    <div className="App">
      {/* <AttentionBox
        title="Hello Monday Apps!"
        text={attentionBoxText}
        type="success"
      /> */}
      <LandingPage />
    </div>
  );
};

export default App;
