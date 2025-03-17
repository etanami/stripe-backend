import { Exclude } from 'class-transformer';
import { Customer } from 'src/customers/customer.entity';
import { PaymentMethod } from 'src/payments/payment-method.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  // Transaction,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastName?: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  @Exclude()
  password: string;

  @OneToOne(() => Customer, (customer) => customer.user)
  @JoinColumn()
  customer: Customer;

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  paymentMethods: PaymentMethod[];

  // @OneToMany(() => Transaction, (transaction) => transaction.user)
  // transactions: Transaction[];
}
