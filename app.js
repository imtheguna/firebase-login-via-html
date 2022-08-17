var  firebaseConfig = {
    apiKey: "AIzaSyAghyhZl1knd9eXubM9ihwcbDB3cagXAHs",
    authDomain: "html-login-cf432.firebaseapp.com",
    projectId: "html-login-cf432",
    storageBucket: "html-login-cf432.appspot.com",
    messagingSenderId: "309518324819",
    appId: "1:309518324819:web:a5e25c2bfd21c6c82de2a6"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database()

const loginForm = document.querySelectorAll('.login-signup')[0]

const signupForm = document.querySelectorAll('.login-signup')[1]

const nav_to_signup = document.querySelector('#nav-to-signup')

const nav_to_login = document.querySelector('#nav-to-login')

const login_submit = document.querySelector('#login-submit')

const signup_submit = document.querySelector('#signup-submit')

const forgotpwd = document.querySelector('.forgot-pwd')

const details = document.querySelector('.user-details')


//const auth = firebase.auth()
//const db = firebase.firestore()

const userDetails = id => {
window.localStorage.setItem('currently_loggedIn',id)

const docRef =  firebase.firestore().collection('users').doc(id)

docRef.get().then(doc => {
if(doc.exists){
    const h1 = details.children[0]
    h1.textContent = `Welcome ${doc.data().userName}`
    const signout = details.children[1]
    details.style.display = 'block'
    signout.addEventListener('click' , () => {
        firebase.auth().signOut().then(() => {
            window.localStorage.removeItem('currently_loggedIn')
            details.style.display = 'none'
            loginForm.style.display = 'block'
        }).catch(() => {
            console.log('Error Occurred While Sign Out')
        })
    })
} else {
    console.log(`No such Document`)
}
}).catch(err => {
console.log(`Error getting document : ${err}`)
})
}

window.onload = () => {
try{
const currentUser = window.localStorage.getItem('currently_loggedIn')
if(currentUser === null){
    throw new Error('No Current User')
} else {
    userDetails(currentUser)
}
}catch(err){
loginForm.style.display = 'block'
}
}

nav_to_signup.addEventListener('click' , () => {
loginForm.style.display = 'none'
signupForm.style.display = 'block'
document.querySelector('#login').reset()
})

nav_to_login.addEventListener('click' , () => {
loginForm.style.display = 'block'
signupForm.style.display = 'none'
document.querySelector('#signup').reset()
})

signup_submit.addEventListener('click' , event => {
event.preventDefault()
signup_submit.style.display = 'none'

const userName = document.querySelector('#signup-username').value 
const email = document.querySelector('#signup-email').value 
const password = document.querySelector('#signup-pwd').value 
firebase.auth().createUserWithEmailAndPassword(email,password).then(cred => {
swal({
    title : 'Account Created Successfully',
    icon : 'success'
}).then(() => {
    firebase.firestore().collection('users').doc(cred.user.uid).set({
        userName : userName,
        email : email,
        id: cred.user.uid
    }).then(() => {
    signup_submit.style.display = 'block'

    document.querySelector('#signup').reset()
    signupForm.style.display = 'none'
    loginForm.style.display = 'block'
}).catch(err => {
    swal({
        title : err,
        icon : 'error'
    }).then(() => {
        signup_submit.style.display = 'block'
       
    })
})
})
}).catch(err => {
swal({
    title : err,
    icon : 'error'
}).then(() => {
    signup_submit.style.display = 'block'
  
})
})
})

login_submit.addEventListener('click' , event => {
event.preventDefault()


const email = document.querySelector('#login-email').value 
const password = document.querySelector('#login-pwd').value 
firebase.auth().signInWithEmailAndPassword(email,password).then(cred => {
swal({
    title : 'Login Success',
    icon : 'success'
}).then(() => {
    login_submit.style.display = 'block'

    document.querySelector('#login').reset()
    loginForm.style.display = 'none'
    userDetails(cred.user.uid)
})
}).catch(err => {
swal({
    title : err ,
    icon :'error'
}).then(() => {
    login_submit.style.display = 'block'

})
})
})

forgotpwd.addEventListener('click' , () => {
swal({
title : 'Reset Password',
content : {
    element : 'input',
    attributes : {
        placeholder : 'Type your Email',
        type : 'email'
    }
}
}).then(val => {
login_submit.style.display = 'none'

firebase.auth().sendPasswordResetEmail(val).then(() => {
    swal({
        title : 'Check Your Email',
        icon : 'success'
        
    }).then(() => {
        login_submit.style.display = 'block'

    })
}).catch(err => {
    swal({
        title : err,
        icon : 'error'
    }).then(() => {
        login_submit.style.display = 'block'

    })
})
})
})
