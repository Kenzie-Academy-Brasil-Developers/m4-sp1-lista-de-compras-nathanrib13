import * as express from 'express'

declare global {
    namespace Express {
        interface Request {
            listPurchase: { 
                indexlistPurchase: number
            }, 
            validatedBody:{
            listName: string,
            data: IListData 
                
            }
        }
    }
}