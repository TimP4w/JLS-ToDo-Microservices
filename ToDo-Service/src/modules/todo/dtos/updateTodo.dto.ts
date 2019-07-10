export class updateTodoDto {
    readonly id: string;
    readonly data: {
        title: string;
        done: boolean;
        date: Date;
    }
    readonly owner: string;

}