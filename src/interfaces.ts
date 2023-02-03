
interface IPurchaseListResquest{
    listName: string,
    data: Array <IListData> 
    }

interface IListData {
    name: string
    quantity: string
}


interface IPurchaseList extends IPurchaseListResquest{
    id: number
}

type IPurchaseListRequiredKeys = "listName" | "data"
type IPurchaseListRequiredData = "name" | "quantity"


export {IPurchaseList, IPurchaseListResquest, IListData, IPurchaseListRequiredKeys, IPurchaseListRequiredData}