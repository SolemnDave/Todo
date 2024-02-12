import { TodoItem } from "./todoItems.js";
import { TodoCollection } from "./todoCollection.js";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

type schemaType = {
  tasks: { id: number; task: string; complete: boolean }[];
};

export class JsonTodocollection extends TodoCollection {
  private database: LowSync<schemaType>;

  constructor(public userName: string, todoItems: TodoItem[] = []) {
    super(userName, []);
    this.database = new LowSync(new JSONFileSync("Todos.json"));
    this.database.read();

    if (this.database.data == null) {
      this.database.data = { tasks: [] };
      todoItems.forEach((item) => {
        this.database.data!.tasks.push({
          id: item.id,
          task: item.task,
          complete: item.complete,
        });
        this.itemMap.set(item.id, item);
      });
      this.database.write();
    } else {
      this.database.data.tasks.forEach((item) =>
        this.itemMap.set(
          item.id,
          new TodoItem(item.id, item.task, item.complete)
        )
      );
    }
  }

  addTodo(task: string): number {
    let result = super.addTodo(task);
    this.storeTasks();
    return result;
  }

  markComplete(id: number, complete: boolean): void {
    super.markComplete(id, complete);
    this.storeTasks();
  }

  removeComplete(): void {
    super.removeComplete();
    this.storeTasks();
  }
  private storeTasks() {
    this.database.data.tasks = [...this.itemMap.values()];
    this.database.write();
  }
}
