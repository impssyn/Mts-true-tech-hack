import {Injectable, OnModuleInit} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {AccountService} from "../account/account.service";
import {ProductService} from "../product/product.service";
import {CardType} from "../product/models/card.model";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private productService: ProductService
  ) {}

  async initMocks() {
    const user1 = await this.userService.createUser({
      username: "test1",
      pwd: "test",
      firstName: "Лев",
      lastName: "Антипов",
      patronymic: "Валерьевич",
      phone: "+79050170888",
      email: "test1@gmail.com",
      isManager: true
    })

    const user2 = await this.userService.createUser({
      username: "test2",
      pwd: "test",
      firstName: "Андрей",
      lastName: "Наместников",
      patronymic: "Евгеньевич",
      phone: "+79050170881",
      email: "test2@gmail.com",
      isManager: true
    })

    await this.productService.createCard({
      userId: user1.id,
      expirationMonth: "09",
      expirationYear: "2025",
      cardType: CardType.DEBIT,
      balance: 2500000,
      number: "5689123456431234",
      cv: "212"
    })

    await this.productService.createCard({
      userId: user1.id,
      expirationMonth: "08",
      expirationYear: "2025",
      cardType: CardType.CREDIT,
      balance: 2500000,
      number: "5689123456431235",
      cv: "121"
    })


    await this.productService.createCard({
      userId: user2.id,
      expirationMonth: "09",
      expirationYear: "2025",
      cardType: CardType.DEBIT,
      balance: 2600000,
      number: "5689123856431234",
      cv: "212"
    })

    await this.productService.createCard({
      userId: user2.id,
      expirationMonth: "05",
      expirationYear: "2025",
      cardType: CardType.CREDIT,
      balance: 2600000,
      number: "5689123456431231",
      cv: "121"
    })

  }

   onModuleInit() {
    this.initMocks().then(() => console.log('Users initialized')).catch((e) => {
      console.log(e)
    })
   }
}