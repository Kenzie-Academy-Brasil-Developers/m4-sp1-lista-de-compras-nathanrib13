import { Request, Response } from "express"
import { dataBase } from "./database"
import { IListData, IPurchaseList, IPurchaseListRequiredData, IPurchaseListRequiredKeys, IPurchaseListResquest } from "./interfaces"


const validateDataPurchaseList = (payload: any): IPurchaseListResquest => {
    
    const keys: Array<string> = Object.keys(payload)
    const dataKeys: Array<string> = Object.keys(payload.data[0])
    const dataValues = Object.values(payload.data[0])
    const requiredKeys: Array<IPurchaseListRequiredKeys> = ["listName", "data"]
    const requiredData: Array<IPurchaseListRequiredData> = ["name", "quantity"]
    
    
     const containsAllListRequired: boolean = requiredKeys.every((key: string)=>{
        return keys.includes(key)
     })
    
    const containsAllDataRequired: boolean = requiredData.every((key: string)=>{
        return  dataKeys.includes(key)
    })
       

     if(!containsAllListRequired){
    throw new Error (`required keys are ${requiredKeys}`)
     }

     if(!containsAllDataRequired || dataKeys.length > 2){
        throw new Error (`required keys are ${requiredData}`)
    }
    
    
    if(typeof dataValues[0] !== 'string' || typeof dataValues[1] !== 'string'){
        throw new Error (`the values of data must be a string type `)
    }

    
     return payload
    }



const createPurchaseList = (req: Request, res: Response): Response => {

const listData: IPurchaseListResquest = validateDataPurchaseList(req.body)

const lastListFromDataBase = dataBase[dataBase?.length - 1]

const newList: IPurchaseList = {
    id: lastListFromDataBase?.id + 1  ,
    ...listData
}

dataBase.push(newList)

return res.status(201).json(newList)  
}

const readAllLists = (req: Request, res: Response): Response => {
    return res.json(dataBase)
}

const readSelectedList = (req: Request, res: Response): Response => {
    const indexlistPurchase : number = req.listPurchase.indexlistPurchase 

    return res.json(dataBase[indexlistPurchase])
}

const updateList = (req: Request, res: Response): Response => {

     
    const keys: Array<string> = Object.keys(req.body)
    const dataKeys: Array<string> = Object.keys(req.body.data[0])
    const dataValues = Object.values(req.body.data[0])
    const requiredKeys: Array<IPurchaseListRequiredKeys> = ["listName", "data"]
    const requiredData: Array<IPurchaseListRequiredData> = ["name", "quantity"]
    
    
     const containsAllListRequired: boolean = requiredKeys.every((key: string)=>{
        return keys.includes(key)
     })
    
    const containsAllDataRequired: boolean = requiredData.every((key: string)=>{
        return  dataKeys.includes(key)
    })

     if(containsAllListRequired){
    throw new Error (`You only can edit ${requiredData}`)
     }

     if(!containsAllDataRequired || dataKeys.length > 2){
        throw new Error (`required keys are ${requiredData}`)
    }
    
    if(typeof dataValues[0] !== 'string' || typeof dataValues[1] !== 'string'){
        throw new Error (`the values of data must be a string type `)
    }


    const indexlistPurchase : number = req.listPurchase.indexlistPurchase
    dataBase[indexlistPurchase] = {...dataBase[indexlistPurchase], ...req.body}

    return res.status(200).json(dataBase[indexlistPurchase])

}

const deleleListItem = (req: Request, res: Response): Response => {

    
    const indexlistPurchase : number = req.listPurchase.indexlistPurchase
    const itemWillBeRemoved : any = dataBase[indexlistPurchase].data.find(el => el.name == req.params.itemName)
    
    const itemToRemove = dataBase[indexlistPurchase].data.indexOf(itemWillBeRemoved)
  
    dataBase[indexlistPurchase].data.splice(itemToRemove, 1)
   
    

    if(!itemWillBeRemoved){
        return res.status(404).json('item not found')
    }
    return res.status(204).json()
}

const deleleList = (req: Request, res: Response): Response => {
    const indexlistPurchase : number = req.listPurchase.indexlistPurchase
    dataBase.splice(indexlistPurchase, 1)
    return res.status(204).json()
}

export {createPurchaseList, readAllLists, readSelectedList, updateList, deleleListItem, deleleList}