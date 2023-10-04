import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getDatabase, ref , onValue, set, push} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD9O3sjJkaqNyKHshbhua8PhelP9toU5i0",
    authDomain: "theprivate-404e9.firebaseapp.com",
    projectId: "theprivate-404e9",
    storageBucket: "theprivate-404e9.appspot.com",
    messagingSenderId: "374618793944",
    appId: "1:374618793944:web:c6c00e8b1e956f4dcc74ad",
    measurementId: "G-1X2SC4FQCD"
  };

  const app = initializeApp(firebaseConfig);

  const email = document.getElementById("userEmail");
  const password = document.getElementById("userPassword");

  const signin = document.getElementById("login-btn");
  const logindiv = document.getElementById("login-div");
  const sendMsg = document.getElementById("send-btn");

  const chatContainer = document.getElementById("chat-container");


    
  const auth = getAuth(app);
  const db = getDatabase(app);

  signin.addEventListener("click",(e)=>{
        e.preventDefault();

        signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential)=>{
            const user = userCredential.user;
            localStorage.setItem('currentUserUid',user.uid);
            logindiv.style.display = "none";
        })
  });

    const currentUser = localStorage.getItem('currentUserUid');
    

    function createChatCard(post){
        // Create a new div element with class "chat-item"
        const chatItemDiv = document.createElement('div');
        chatItemDiv.classList.add('chat-item');        

        // Create a paragraph element for the username
        const usernamePara = document.createElement('p');
                usernamePara.id = 'username';

        // Create a paragraph element for the message
        const messagePara = document.createElement('p');
        messagePara.id = 'message';
        messagePara.textContent = post.message;

        // Append the username and message paragraphs to the chat-item div
        chatItemDiv.appendChild(usernamePara);
        chatItemDiv.appendChild(messagePara);

        // Append the chat-item div to the document body or another container
        chatContainer.appendChild(chatItemDiv);

        const userData = ref(db,'users/'+post.username);
        onValue(userData, (snapshot)=>{
            const data = snapshot.val();
            if(data){
                usernamePara.textContent = data.name+":";
            }
        });

    }

    function getMessage(callback){
        chatContainer.innerHTML = "";
        

        const chatData = ref(db,'Chats');
        // Remove the previous event listener (if any) to prevent duplicates
        onValue(chatData, (snapshot)=>{
            const data = snapshot.val();
            callback(data);
        });
    }

    function displayMessage(data){
        chatContainer.innerHTML = ""; // Clear the chat container

     for (let key in data) {
        const post = data[key];
        createChatCard(post);
        }
    }

    if(currentUser){
        logindiv.style.display = "none";
        chatContainer.style.display = "flex";
        getMessage(displayMessage)
        
    }
    else{
        logindiv.style.display = "flex";
        chatContainer.style.display = "none";
    }



    function uploadMessage(messageText, username) {
        const db = getDatabase();
        // Reference to the "messages" node in your Firebase database
        const timestamp = Date.now();

        set(ref(db,'Chats/'+timestamp),{
            message: messageText,
            username: username
        })
        .then(()=>{
            console.log("Message uploaded successfully!");
        })
        .catch((error)=>{
            console.log("Error uploading message:", error);
        })

      }
      

    sendMsg.addEventListener("click",(e)=>{
        e.preventDefault();
        const message = document.getElementById("message-input");
        uploadMessage(message.value, currentUser);
        message.value = "";
    });