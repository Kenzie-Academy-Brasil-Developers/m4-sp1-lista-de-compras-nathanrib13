import { Request, Response } from "express"
import { dataBase } from "./database"
import { IPurchaseList, IPurchaseListRequiredData, IPurchaseListRequiredKeys, IPurchaseListResquest } from "./interfaces"


const validateDataPurchaseList = (payload: any): IPurchaseListResquest => {
    
    const keys: Array<string> = Object.keys (payload)
    const dataKeys: Array<string> = payload.data.map((el:Array<string>) => Object.keys(el))
    const dataValues: Array<string> = payload.data.map((el:Array<string>) => Object.values(el))
    const requiredKeys: Array<IPurchaseListRequiredKeys> = ["listName", "data"]
    const requiredData: Array<IPurchaseListRequiredData> = ['name', 'quantity']

    
     const containsAllListRequired: boolean = requiredKeys.every((key: string)=>{
        return keys.includes(key)
     })
    

    let dataRequiredIsOk = true
     const containsAllDataRequired: any = dataKeys.forEach((dataKey: any)=> {
      if(JSON.stringify(dataKey) !== JSON.stringify(requiredData)){
        dataRequiredIsOk = false
      }
    })

     if(!containsAllListRequired){
    throw new Error (`required keys are ${requiredKeys}`)
     }

     if(!dataRequiredIsOk){
        throw new Error (`required keys are ${requiredData}`)
    }

    dataValues.forEach((dataValue: any)=> {
        if(typeof dataValue[0] !== 'string'  || typeof dataValue[1] !== 'string'){
            throw new Error (`the values of data must be a string type `)
        }
    })

    dataValues.forEach((dataValue)=> {
        if(dataValue[0].length <= 0 || dataValue[1].length <= 0){
            throw new Error (`the values of data can not be empty `)
        }
    })
    
     return payload
    }



const createPurchaseList = (req: Request, res: Response): Response => {
try{ 
const listData: IPurchaseListResquest = validateDataPurchaseList(req.body)

const lastListFromDataBase = dataBase[dataBase?.length - 1]

const newList: IPurchaseList = {
    id: lastListFromDataBase?.id + 1 || 1,
    ...listData
}

dataBase.push(newList)

return res.status(201).json(newList)  }
catch(error){
    if(error instanceof Error){
        return res.status(400).json({
            message: error.message
        })
    }
    return res.status(500).json({
        message: 'internal server error'
    })
}
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
    const indexlistPurchase : number = req.listPurchase.indexlistPurchase
    
     const containsAllListRequired: boolean = requiredKeys.every((key: string)=>{
        return keys.includes(key)
     })
    
    const containsAllDataRequired: boolean = requiredData.every((key: string)=>{
        return  dataKeys.includes(key)
    })

     if(containsAllListRequired){
        return res.status(400).json({message: `You only can edit ${requiredData}`})
     }

     if(!containsAllDataRequired || dataKeys.length > 2){
        return res.status(400).json({ message: `required keys are ${requiredData}`})
    }
    
    if(typeof dataValues[0] !== 'string' || typeof dataValues[1] !== 'string'){
         return res.status(400).json({ message: `the values of data must be a string type `})
    }

    const itemWillBeEdited : any = dataBase[indexlistPurchase].data.find(el => el.name == req.params.itemName)
    const itemToRemove = dataBase[indexlistPurchase].data.indexOf(itemWillBeEdited)

    if(!itemWillBeEdited){
        return res.status(404).json({
            message:  `Item with name ${req.params.itemName} does not exist` 
        })
    }

    
    dataBase[indexlistPurchase].data[itemToRemove] = req.body.data[0]
  

    return res.status(200).json(dataBase[indexlistPurchase])

}

const deleleListItem = (req: Request, res: Response): Response => {

    
    const indexlistPurchase : number = req.listPurchase.indexlistPurchase
    const itemWillBeRemoved : any = dataBase[indexlistPurchase].data.find(el => el.name == req.params.itemName)
    const itemToRemove = dataBase[indexlistPurchase].data.indexOf(itemWillBeRemoved)

    if(!itemWillBeRemoved){
        return res.status(404).json({
            message: "item not found"
        })
    }

    dataBase[indexlistPurchase].data.splice(itemToRemove, 1)

    return res.status(204).json()
}

const deleleList = (req: Request, res: Response): Response => {
    const indexlistPurchase : number = req.listPurchase.indexlistPurchase
    dataBase.splice(indexlistPurchase, 1)
    return res.status(204).json()
}

export {createPurchaseList, readAllLists, readSelectedList, updateList, deleleListItem, deleleList}