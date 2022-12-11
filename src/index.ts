import { fetchAll } from "./bookList";

const express = require("express");
const app = express(); //创建一个express应用


app.get("/getBookList", async (req, res, next) => {
  const bookList = await fetchAll()
  res.send({
    code: 2000,
    data: bookList
  })
});

const port = 5008;
app.listen(port, () => {
  console.log(`server listen on ${port}`);
});
