import Client from '../structures/Client';
import PouchDB from 'pouchdb';

export default class Database {
    public client: Client;
    // eslint-disable-next-line @typescript-eslint/ban-types
    public repo: PouchDB.Database<{}>;
    constructor(client: Client) {
        this.client = client;
        this.repo = new PouchDB('data');
    }
}
