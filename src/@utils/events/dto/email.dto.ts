export class BaseEmailDto<T> {
    to: string;
    subject: string;
    title: string;
    partialContext: T;
}
