import { Body, Controller, Get, Post, Res, Param, Put } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AccountDto } from './dtos/account.dto';

@Controller('/api/v1/stripe')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/account/create')
  async createAccount(@Res() res: Response) {
    const response = await this.appService.createAccount();
    res.send(response);
  }

  @Post('/account/create/new')
  async createNewAccount(@Res() res: Response) {
    const account = await this.appService.createNewAccount();
    res.send(account);
  }

  @Post('/account-link/create/:id')
  async createAccountLink(@Res() res: Response, @Param() params) {
    console.log(params.id);
    const response = await this.appService.createAccountLink(params.id);
    res.send(response);
  }

  @Get('/account/retrieve/all')
  async getAllAccount(@Res() res: Response) {
    const connectedAcc = await this.appService.getAccounts();
    res.send(connectedAcc);
  }

  @Get('/account/retrieve/:accId')
  async getAccount(@Res() res: Response, @Param() param) {
    const connectedAcc = await this.appService.getAccount(param.accId);
    res.send(connectedAcc);
  }

  @Put('/account/update/:accId')
  async updateAccount(@Res() res: Response, @Param() params) {
    const { accId } = params;
    const response = await this.appService.updateAccount(accId);
    res.send(response);
  }

  @Post('/payment/create')
  async doPayment(@Res() res: Response) {
    const session = await this.appService.doPayment();
    res.send(session.url);
  }

  @Get('/payment/success')
  paymentSuccess(@Res() res: Response) {
    res.send('<h1>Payment Successfull</h1>');
  }

  @Get('/payment/cancel')
  paymentCancel(@Res() res: Response) {
    res.send('<h1>Payment Canceled</h1>');
  }
}
