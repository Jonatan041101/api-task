export interface IUserRepository{
    getCurrentUser(email:string):Promise<any>
}