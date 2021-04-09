import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTask(): Task[] {
    return this.taskService.getAllTasks();
  }

  @Get('/filter')
  getTask(@Query() filterDto: GetTasksFilterDto) {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTaskWhitFilters(filterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    const task = this.taskService.createTask(createTaskDto);
    return {
      status: 'ok',
      message: 'Task created',
      task,
    };
  }

  @Put('/:id')
  updateTask(@Param('id') id: string, @Body('status') status: TaskStatus) {
    const task = this.taskService.updateTask(id, status);

    return { status: 'ok', message: 'Task updated', task };
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    const task = this.taskService.deleteTask(id);

    if (task) {
      return {
        status: 'ok',
        message: 'Task deleted',
        task,
      };
    } else {
      return {
        status: 'false',
        message: 'The task does not exist',
      };
    }
  }
}
