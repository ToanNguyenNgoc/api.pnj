import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { customOptions, options } from './docs';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //ADD: swagger
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, customOptions);
  await app.listen(process.env.APP_PORT || 4080);
  //ADD: permissions
  await generatePermissions(app);
  console.log(`Server run PORT:${process.env.APP_PORT}`);
}
const generatePermissions = async (app: NestExpressApplication) => {
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const routes = router.stack
    .filter((layer) => layer.route)
    .map((layer) =>
      `${layer.route?.path}.${Object.keys(layer.route?.methods)[0]}`.replaceAll(
        '/',
        '',
      ),
    );

  // console.log('All Registered Routes:', routes);
  const permissions = routes.reduce((acc, item) => {
    acc[item] = item;
    return acc;
  }, {});

  fs.writeFileSync(
    'permissions.json',
    JSON.stringify(permissions, null, 2),
    'utf8',
  );

  console.log('Permissions JSON file generated successfully.');
};
bootstrap();
