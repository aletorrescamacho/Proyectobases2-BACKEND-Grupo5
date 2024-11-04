export class CreateUserDto {
    usuario_id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    date_of_birth: Date; // Puede enviarse como 'YYYY-MM-DD' y se convertirá a tipo `Date`
  }
  