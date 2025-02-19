export class UserResponse {
    public id: string;
    public name: string;
    public email: string;
    public password: string;
    public phone: string;
    public profession?: string;
    public averageRating: number;

    constructor(id: string, name: string, email: string, password: string, phone: string, averageRating: number, profession?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.profession = profession;
        this.averageRating = averageRating;
    }
}