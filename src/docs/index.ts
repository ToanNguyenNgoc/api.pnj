import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';

export const options = new DocumentBuilder()
  .setTitle('Shadow Company API')
  .setDescription('The API description')
  .setVersion('1.0')
  .setContact('Shadow one', '', 'ngoctoan06011998@gmail.com')
  .addTag(SWAGGER_TAG.Auth)
  .addApiKey(
    {
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    },
    'x-api-key',
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    NAME.JWT,
  )
  .build();
export const customOptions: SwaggerCustomOptions = {
  customSiteTitle: 'Shadow Company API',
};
