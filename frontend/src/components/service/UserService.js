import axios from "axios";

class UserService{
    static BASE_URL = "http://localhost:8080"

    static async login(email, password){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {email, password})
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            this.notifySubscribers();
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async register(userData){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData)
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async ForgotPassword(email){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/forgotPassword`, {email})
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async ResetPassword(tokenPassword, newPassword){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/resetPassword`, {tokenPassword, newPassword})
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(userId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUsersByName(myName ,nameFind, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-users-byName/${nameFind}/butNot/${myName}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async deleteUser(userId, token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async updateUser(userId, userData, token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getAddFriendList(userId , token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-addFriendList/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async acceptFriend(Id , token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/adminuser/acceptFriend/${Id}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async denyFriend(Id , token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/adminuser/denyFriend/${Id}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getFriends(userId, token) {
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/getFriends/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getChatRooms(userId, token) {
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/getChatRooms/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUsersByNameNotInChatRoom(chatRoomId ,nameFind, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-users-byNameNotInChatRoom/${nameFind}/butNot/${chatRoomId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    
    static async addMemberChatRooms(memberId, chatRoomId, token) {
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/member/${memberId}/to/${chatRoomId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**AUTHENTICATION CHECKER */
    static subscribers = []; 

    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        this.notifySubscribers();
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }

    static subscribe(callback) {
        this.subscribers.push(callback);
        return {
            unsubscribe: () => {
                this.subscribers = this.subscribers.filter(sub => sub !== callback);
            }
        };
    }

    static notifySubscribers() {
        this.subscribers.forEach(callback => callback());
    }

}

export default UserService;