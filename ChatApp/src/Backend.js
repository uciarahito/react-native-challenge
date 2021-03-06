import firebase from 'firebase'

class Backend {
    uid = ''
    messageRef = null

    constructor() {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyD24yLtsmsK7C0Jp_X8wr5-OC0fGlHWPnQ",
            authDomain: "build-something-could.firebaseapp.com",
            databaseURL: "https://build-something-could.firebaseio.com",
            storageBucket: "build-something-could.appspot.com"
        };
        firebase.initializeApp(config);

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setUid(user.uid)
            } else {
                firebase.auth().signInAnonymously().catch(error => {
                    alert(error.message)
                })
            }
        })
    }

    setUid(value) {
        this.uid = value
    }

    getUid() {
        return this.uid
    }

    loadMessages(callback) {
        this.messageRef = firebase.database().ref('messages')
        this.messageRef.off()
        const onReceive = data => {
            const message = data.val()
            console.log('ini message: ', message)
            callback({
                _id: data.key,
                text: message.text,
                createdAt: new Date(message.createdAt),
                user: {
                    _id: message.user._id,
                    name: message.user.name,
                }
            })
        }
        this.messageRef.limitToLast(20).on('child_added', onReceive)
    }

    // send the message to the Backend
    sendMessage(message) {
        for (let i = 0; i < message.length; i++) {
            this.messageRef.push({
                text: message[i].text,
                user: message[i].user,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            })
        }
    }

    // close the connection to the Backend
    closeChat() {
        if (this.messageRef) {
            this.messageRef.off()
        }
    }
}

export default new Backend()