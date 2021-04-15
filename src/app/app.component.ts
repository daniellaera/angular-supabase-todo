import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Todo } from './todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  todos: Todo[];
  todo: Todo;
  actionLabel: string;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    let listen = this.api.listenAll();
    this.api.getTodos().then((data) => (this.todos = data.todos));
    this.clear();
  }

  addTodo() {
    if (this.todo.id) {
      //Update if exists ID{
      this.update();
      return;
    }
    this.api
      .addTodo(this.todo)
      .then((payload) => {
        this.todos.push(payload.data[0]);
      })
      .catch((err) => console.log(`Error in add TODO ${err}`));
    this.clear();
  }

  editTodo(todo: Todo) {
    this.todo = todo;
    this.actionLabel = 'UPDATE';
  }

  update() {
    this.api.update(this.todo).then(() => {
      let foundIndex = this.todos.findIndex((t) => t.id == this.todo.id);
      this.todos[foundIndex] = this.todo;
      this.clear();
    });
  }

  checkTodo(todoCheck: Todo) {
    todoCheck.done = !todoCheck.done;
    this.api.updateCheck(todoCheck);
  }

  delete(todo: Todo) {
    this.api
      .deleteTodo(todo.id)
      .then((res) => {
        (this.todos = this.arrayRemove(this.todos, todo.id));
        // console.log('res', res.data)
      });

  }

  arrayRemove(arr: Todo[], id: string) {
    return arr.filter((ele) => ele.id != id);
  }

  clear() {
    this.todo = new Todo();
    this.actionLabel = 'ADD';
  }
}
