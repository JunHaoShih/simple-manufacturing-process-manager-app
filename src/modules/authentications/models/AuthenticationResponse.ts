export interface AppUser {
  id: number,
  username: string,
  fullName: string,
}

export interface AuthenticationResponse {
  token: string,
  appUser: AppUser,
}
