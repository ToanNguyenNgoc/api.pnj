import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { join } from 'path';
import { of } from 'rxjs';
import { Response } from 'express';
import { jsonResponse } from 'src/commons';
import { OAuthGuard } from 'src/middlewares';

const validatorsFile = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 30000000 }),
    new FileTypeValidator({ fileType: /^(image|video)\// }),
  ],
});

@ApiTags(SWAGGER_TAG.Media)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiBearerAuth(NAME.JWT)
  // @UseGuards(OAuthGuard)
  @ApiOkResponse({ description: 'Upload image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './media',
        filename: (req, file, callback) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            new Date().getTime();
          const extensions = path.parse(file.originalname).ext;
          callback(null, `${filename}${extensions}`);
        },
      }),
    }),
  )
  async update(
    @UploadedFile(validatorsFile)
    file: Express.Multer.File,
  ) {
    return jsonResponse(await this.mediaService.update(file));
  }
  @ApiExcludeEndpoint()
  @Get(':imagename')
  getImageByName(@Param('imagename') imagename: string, @Res() res: Response) {
    return of(res.sendFile(join(process.cwd(), '/media/' + imagename)));
  }
}
