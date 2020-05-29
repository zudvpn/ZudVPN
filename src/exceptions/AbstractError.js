export default class AbstractError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}