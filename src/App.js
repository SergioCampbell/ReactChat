/* eslint-disable no-undef */
import React, {useState} from 'react'
import './App.css';
//firebase imports
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
//hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

//firebase config
firebase.initializeApp({
    apiKey: "AIzaSyCuRrtUd0lBdqlCbHXIP6rtWue6xD9VhYQ",
    authDomain: "chat-react-c9d77.firebaseapp.com",
    projectId: "chat-react-c9d77",
    storageBucket: "chat-react-c9d77.appspot.com",
    messagingSenderId: "1021733886037",
    appId: "1:1021733886037:web:99d7c1c5e408dc5c9c9cdc"
});

const auth = firebase.auth();
const firestore = firebase.firestore(); 


function App(){

  const [user] = useAuthState(auth);

  return(
    <div className="App mt-3">
    <header className="App-header">
    <h1>React & firebase chat Room </h1>
    <SignOut />
    </header>

    <section>
      { user ? <Channel /> : <SignIn /> }
    </section>    
    </div>

);

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }

  return (
    <button className="btn btn-secondary" onClick={signInWithGoogle}>
    
<svg style={{paddingRight: 10}} width="43" height="50" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
      Sign in with Google
    </button>
  )      
}

function SignOut(){
  return auth.currentUser && (

    <button className="btn btn-danger" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  )
}


function Channel() {

  const messageRef = firestore.collection('message');
  const query = messageRef.orderBy('created_At').limit(25);

  const [message] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
      e.preventDefault();

      const { uid, photoURL } = auth.currentUser;

      await messageRef.add({
        txt: formValue,
        created_At: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      });

      setFormValue('');
      //dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main className="container-fluid">
      {message && message.map(msg => <ChatMessage key={msg.id} message={msg} />)}
   
      {/* <span ref={dummy}></span> */}
      
    </main>

    
    <form onSubmit={sendMessage} className="mb-3">

      <input value={formValue}
      onChange={(e) => setFormValue(e.target.value)}
      placeholder="Say something cool"
      />

      <button type="submit" 
      className="btn btn-danger"
      disabled={!formValue}>
      <i className="far fa-paper-plane"></i>
      </button>

    </form>

      <strong>
        Develop by <a href="https://sergiocampbell.github.io/sacv">
          SACV
        </a>
      </strong>

    </>)
}

//messages
function ChatMessage(props) {
  const { txt, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(
    <>
    <div className={`message ${messageClass}`}>
      
      <img 
      src={photoURL || 'https://w7.pngwing.com/pngs/571/251/png-transparent-meme-face-internet-meme-rage-comic-trollface-meme-comics-white-face.png'}
      alt="avatar" 
      height={50}
      width={50}
      className="rounded-circle border border-info avatar"/>

      <p className="msg">{txt}</p>
      
    </div> 

    </>
  )
}

}

export default App;
