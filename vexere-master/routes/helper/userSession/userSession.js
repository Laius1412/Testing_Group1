class UserSessionManager {
    constructor() {
        this.users = {};
        setInterval(this.infLoopSessionKiller, 36e5);
    }
    async infLoopSessionKiller() {
        console.log("check to kill");
        const deleteFlag = [];
        if (!this.users) {
            return;
        }
        Object.entries(this.users).forEach(([key, value]) => {
            const hours = Math.abs((new Date()).getTime() - value.createTime.getTime()) / 36e5;
            if (hours >= 10) {
                deleteFlag.push(key);
            }
        });
        deleteFlag.forEach((deleteKey) => {
            this.reomoveUser(deleteKey);
        });
    }
    addUser(sid, userData) {
        if (this.isLogged(sid)) {
            return false;
        }
        this.users[sid] = {
            ...userData,
            createTime: new Date()
        };
        return true;
    }
    reomoveUser(sid) {
        if (!this.isLogged(sid)) {
            return false;
        }
        delete this.users[sid];
        return true;
    }
    isLogged(sid) {
        return this.users.hasOwnProperty(sid);
    }
    checkAndRefreshed(sid) {
        if (this.isLogged(sid)) {
            this.users[sid].createTime = new Date();
            return true;
        }
        return false;
    }
}
export default UserSessionManager;
