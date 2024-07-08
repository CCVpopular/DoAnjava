import axios from "axios";

class PrivateMessageService{
    static BASE_URL = "http://localhost:8080"

    static async getMessagesBetweenUsers(sender, receiver, token){
        try{
            const response = await axios.get(`${PrivateMessageService.BASE_URL}/api/messages/private/${sender}/and/${receiver}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }
}

export default PrivateMessageService;