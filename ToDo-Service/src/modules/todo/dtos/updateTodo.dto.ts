export class updateTodoDto {
    readonly id: string;
    readonly task: {
        title: string;
        done: boolean;
        date: Date;
    }
    readonly owner: string;

}