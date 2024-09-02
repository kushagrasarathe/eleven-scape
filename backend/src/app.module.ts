import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExampleController } from './example/example.controller';

@Module({
  imports: [],
  controllers: [AppController, ExampleController],
  providers: [AppService],
})
export class AppModule {}
