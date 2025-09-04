export default class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age || null;
        this.role = user.role;
        this.cart = user.cart || null;
        this.createdAt = user.createdAt || null;
    }


    static fromList(users) {
        return users.map(u => new UserDTO(u));
    }
}
