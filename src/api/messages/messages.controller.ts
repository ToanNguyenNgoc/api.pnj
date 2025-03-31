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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { OAuthGuard } from 'src/middlewares';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { RequestHeaderType } from 'src/types';
import { User } from '../users/entities/user.entity';
import { QrMessage } from './dto/query-message.dto';

@Controller('messages')
@ApiTags(SWAGGER_TAG.Topic_Message)
@UseGuards(OAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(
    @Req() req: RequestHeaderType<User>,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(req.user, createMessageDto);
  }

  @Get()
  findAll(@Req() req: RequestHeaderType<User>, @Query() qr: QrMessage) {
    return this.messagesService.findAll(req.user, qr);
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  // @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
