import { Response, Request, NextFunction } from "express";
import { dataBase } from "./database";



const doesListExist = (req: Request, res: Response, next: NextFunction): Response | void => {
    const purchaseListId: number = parseInt(req.params.purchaseListId)
    const indexlistPurchase = dataBase.findIndex(el => el.id === purchaseListId) 

    if(indexlistPurchase == -1){
        return res.status(404).json({
            message: 'id not found'
        })
    }

    req.listPurchase = {
        indexlistPurchase: indexlistPurchase
    }

    return next()
}

export {doesListExist}