import { ApiControllerDocument, DEFALUT_APP_NAME } from '@app/common';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';

@ApiControllerDocument(`[${DEFALUT_APP_NAME}] Admin - slack API`)
// @UseGuards(AdminJwtGuard)
@Controller('/admin/slack')
@UseInterceptors(ClassSerializerInterceptor)
export class SlackController {
  @Post('/action')
  async getAction(@Body() body: any): Promise<void> {
    console.log(body);

    return;
  }
}
