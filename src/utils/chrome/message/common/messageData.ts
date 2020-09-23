import MSGENUM from './enum';

export default class MessageData {
    from: null | MSGENUM
    type: string | number
    data: any
    constructor(from: null | MSGENUM, type: string, data: any) {
        this.from = from;
        this.type = type;
        this.data = data;
    }
}