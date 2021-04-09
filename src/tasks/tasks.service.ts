import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus, Task } from './tasks.model';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'hacer comida',
      description: 'para el almuerzo',
      status: TaskStatus.DONE,
    },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWhitFilters(filtersDto: GetTasksFilterDto): Task[] {
    const { status, search } = filtersDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = this.tasks.filter((t) => t.status === status);
    }

    if (search) {
      tasks = this.tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((t) => t.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, status: TaskStatus): Task {
    this.tasks = this.tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: status,
        };
      }
      return t;
    });

    return this.getTaskById(id);
  }

  deleteTask(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);

    if (task) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      return task;
    } else {
      return undefined;
    }
  }
}
