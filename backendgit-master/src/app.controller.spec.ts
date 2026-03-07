// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController], // ❌ ไม่ต้องมี providers: [AppService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('health returns ok:true', () => {
    expect(appController.health()).toEqual({ ok: true });
  });
});
