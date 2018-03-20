import { Connection, Model, Document, Schema } from 'mongoose';

export class Database<Data, DataModel extends Document> {
    private document: Model<Document>;
    private connection: Connection;
    private mongoose = require('mongoose');

    constructor(public collection: string, private dataSchema: Schema) {

    }

    public async  connect(): Promise<boolean> {
        await this.doConnect();
        return Promise.resolve(this.connection != null);
    }

    private doConnect<DataModel extends Document>(): void {
        const url = 'mongodb://benjamin:150594@ds129344.mlab.com:29344/projet2';
        this.connection = this.mongoose.createConnection(url, { useMongoClient: true }, (error: Error) => {
            if (error) {
                console.log(error.message);
            }
        });
        this.document = this.connection.model<DataModel>(this.collection, this.dataSchema);
    }

    public close(): void {
        this.connection.close();
    }

    public async findOne<Data>(dataFind: Data): Promise<boolean> {
        let find = false;
        await this.document.findOne(dataFind).then(result => {
            if (result !== null) {
                find = true;
            }
        });
        return Promise.resolve(find);
    }

    public async getFindOne<Data>(dataFind: Data): Promise<Document> {
        return await this.document.findOne(dataFind);
    }

    public async delete<Data>(dataDelete: Data): Promise<boolean> {
        let success = false;
        await this.document.findOneAndRemove(dataDelete).then(result => {
            if (result !== null) {
                success = true;
            }
        });
        return Promise.resolve(success);
    }

    public async update<Data>(oldData: Data, dataUpdate: Data): Promise<boolean> {
        let succes = false;
        await this.document.findOneAndUpdate(oldData, dataUpdate).then(result => {
            succes = (result != null);
        });
        return Promise.resolve(succes);
    }

    public async insert<Data>(data: Data): Promise<void> {
        await this.document.create(data).catch(reason => {
            console.log(reason);
        });
    }

    public async find<Data>(): Promise<Array<Document>> {
        const array = new Array<Document>();
        await this.document.find().then(res => {
            res.forEach(element => {
                array.push(element);
            });
        });
        return Promise.resolve(array);
    }
}
