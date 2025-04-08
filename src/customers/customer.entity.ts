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

  @Column({ type: 'varchar', length: 96, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 96, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 96, nullable: true })
  phone?: string;

  @OneToOne(() => StripeCustomer)
  @JoinColumn({ name: 'stripe_customer_id' })
  stripeCustomer: StripeCustomer;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
