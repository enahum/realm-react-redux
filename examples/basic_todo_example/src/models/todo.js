
export class ToDo {
    static schema = {
        name: 'ToDo',
        primaryKey: 'id',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            completed: { type: 'bool', default: false },
            createAt: {type: 'int', default: Date.now()}
        }
    };
}
