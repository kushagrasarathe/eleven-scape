import { Controller, Get } from '@nestjs/common';

@Controller('example')
export class ExampleController {
  @Get()
  getExample(): string {
    return 'Hello, NestJS!';
  }
}
