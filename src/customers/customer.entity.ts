import { StripeCustomer } from 'src/stripe-customers/stripe-customer.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToOne(() => StripeCustomer)
  @JoinColumn({ name: 'stripe_customer_id' })
  stripeCustomer: StripeCustomer;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
