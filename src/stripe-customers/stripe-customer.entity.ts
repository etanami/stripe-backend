import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StripeCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;
}
