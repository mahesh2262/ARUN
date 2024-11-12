export class LoginDetails {
  UserName: string;
  Password: string;
}

export class AuthResponse {
  EmpId: string;
  PositionId: string;
  Role: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DisplayName: string;
  Email: string;
  Mobile: string;
  Token: string;
}

export class ForgotPassword {
  EmpId: string;
  EmailAddress: string;
  NewPassword: string;
  Token: string;
}

export class ChangePassword {
  EmpId: string;
  CurrentPassword: string;
  NewPassword: string;
}
