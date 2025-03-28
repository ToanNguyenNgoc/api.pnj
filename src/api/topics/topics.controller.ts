import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OAuthGuard } from 'src/middlewares';
import { RequestHeaderType } from 'src/types';
import { User } from '../users/entities/user.entity';
import { QrTopic } from './dto/query-topic.dto';

@Controller('topics')
@ApiTags(SWAGGER_TAG.Topic_Message)
@UseGuards(OAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  create(@Req() req: RequestHeaderType<User>, @Body() body: CreateTopicDto) {
    return this.topicsService.create(req.user, body);
  }

  @Get()
  findAll(@Req() req: RequestHeaderType<User>, @Query() qr: QrTopic) {
    return this.topicsService.findAll(req.user, qr);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(+id, updateTopicDto);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }
}
