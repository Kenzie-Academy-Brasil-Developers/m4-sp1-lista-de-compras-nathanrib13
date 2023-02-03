
import express, { Application } from "express";
import {createPurchaseList, deleleList, deleleListItem, readAllLists, readSelectedList, updateList} from "./logic"
import { doesListExist } from "./middlewares";

const app:Application = express()
app.use(express.json())

app.post("/purchaseList", createPurchaseList)
app.get("/purchaseList", readAllLists)
app.get("/purchaseList/:purchaseListId", doesListExist, readSelectedList)
app.patch("/purchaseList/:purchaseListId/:itemName", doesListExist, updateList)
app.delete("/purchaseList/:purchaseListId/:itemName", doesListExist, deleleListItem)
app.delete("/purchaseList/:purchaseListId", doesListExist, deleleList)


app.listen(3000, () => {
    console.log("Server is runnig")
})