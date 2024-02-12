import { TodoItem } from "./todoItems.js";
import { TodoCollection } from "./todoCollection.js";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
export class JsonTodocollection extends TodoCollection {
    userName;
    database;
    constructor(userName, todoItems = []) {
        super(userName, []);
        this.userName = userName;
        this.database = new LowSync(new JSONFileSync("Todos.json"));
        this.database.read();
        if (this.database.data == null) {
            this.database.data = { tasks: [] };
            todoItems.forEach((item) => {
                this.database.data.tasks.push({
                    id: item.id,
                    task: item.task,
                    complete: item.complete,
                });
                this.itemMap.set(item.id, item);
            });
            this.database.write();
        }
        else {
            this.database.data.tasks.forEach((item) => this.itemMap.set(item.id, new TodoItem(item.id, item.task, item.complete)));
        }
    }
    addTodo(task) {
        let result = super.addTodo(task);
        this.storeTasks();
        return result;
    }
    markComplete(id, complete) {
        super.markComplete(id, complete);
        this.storeTasks();
    }
    removeComplete() {
        super.removeComplete();
        this.storeTasks();
    }
    storeTasks() {
        this.database.data.tasks = [...this.itemMap.values()];
        this.database.write();
    }
}
