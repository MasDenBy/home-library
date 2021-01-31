import express from 'express';

class BooksMiddleware {
    private static instance: BooksMiddleware;

    static getInstance() {
        if (!BooksMiddleware.instance) {
            BooksMiddleware.instance = new BooksMiddleware();
        }
        return BooksMiddleware.instance;
    }

    async validateRequiredBookBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.title) {
            next();
        } else {
            res.status(400).send({error: `Missing required fields: title`});
        }
    }

    async extractBookId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.bookId;
        next();
    }
}

export default BooksMiddleware.getInstance();