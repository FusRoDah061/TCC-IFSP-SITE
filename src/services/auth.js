class AuthStorage {
    setUser (payload){
        payload.expiresAt = new Date().addDays(6);
        localStorage.usuario = JSON.stringify(payload);
    }

    getUser () {  
        if(localStorage.usuario)
            return JSON.parse(localStorage.usuario);
    }

    hasExpirated(user) {
        let today = new Date();
        let expiration = new Date(user.expiresAt);

        console.log(today, expiration);

        return today > expiration;
    }

    removeUser() {
        localStorage.removeItem("usuario");
    }
}

export default new AuthStorage();