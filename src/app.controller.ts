import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class BaseController {
  @Get('')
  @Redirect('/front')
  async redir() {
    return {};
  }
}
