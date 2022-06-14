export class BaseEmailDto<T> {
    to: string;
    subject: string;
    title: string;
    partialContext: T;

    constructor({ to, title, subject }) {
        this.to = to;
        this.title = title;
        this.subject = subject;
    }
}
