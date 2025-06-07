<template>
  <div class="container-fluid p-4">
    <div class="landingPage">
      <transition name="slide-left">
        <div class="imageAspect" v-if="showPage">
          <img src="../assets/images/JARIPEO.jpeg" alt="">
        </div>
      </transition>

      <transition name="slide-right">
        <div class="authentications" v-if="showPage">
          <h3 class="text-center" v-if="isLogin">Welcome back</h3>
          <h3 class="text-center" v-else>Join site name</h3>
          <div class="loginAspect">
            <template v-if="isLogin">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control form-control-lg" id="email" placeholder="Enter Email" v-model="email">
              <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>
              
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control form-control-lg" id="password" placeholder="Enter Password" v-model="password">
              <div v-if="errors.password" class="error-msg">{{ errors.password }}</div>
              
              <button class="btn btn-primary my-4 center-btn" @click="validateLogin" :disabled="isSubmitting">Login</button>
              <p class="text-center">
                Don't have an account?
                <span @click="toggleForm" style="color:blue;cursor:pointer;">Create account</span>
              </p>
            </template>
            <template v-else>
              <label for="FirstName" class="form-label">First Name</label>
              <input type="text" class="form-control form-control-lg" id="FirstName" placeholder="Enter first name" v-model="firstName">
              <div v-if="errors.firstName" class="error-msg">{{ errors.firstName }}</div>
              
              <label for="lastName" class="form-label">Last Name</label>
              <input type="text" class="form-control form-control-lg" id="lastName" placeholder="Enter last name" v-model="lastName">
              <div v-if="errors.lastName" class="error-msg">{{ errors.lastName }}</div>
              
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control form-control-lg" id="email" placeholder="Enter Email" v-model="email">
              <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>
              
              <label for="age" class="form-label">Age</label>
              <input type="number" class="form-control form-control-lg" id="age" placeholder="Enter age" v-model="age">
              <div v-if="errors.age" class="error-msg">{{ errors.age }}</div>
              
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <input type="number" class="form-control form-control-lg" id="phoneNumber" placeholder="Enter phone number" v-model="phoneNumber">
              <div v-if="errors.phoneNumber" class="error-msg">{{ errors.phoneNumber }}</div>
              
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control form-control-lg" id="password" placeholder="Enter Password" v-model="password">
              <div v-if="errors.password" class="error-msg">{{ errors.password }}</div>
              
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input type="password" class="form-control form-control-lg" id="confirmPassword" placeholder="Confirm Password" v-model="confirmpassword">
              <div v-if="errors.confirmPassword" class="error-msg">{{ errors.confirmPassword }}</div>
              
              <button class="btn btn-success my-4 center-btn" @click="validateSignUp" :disabled="isSubmitting">Sign Up</button>
              <p class="text-center">
                Already have an account?
                <span @click="toggleForm" style="color:blue;cursor:pointer;">Login</span>
              </p>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import mockstorage from '@/stores/mockstorage.js'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
export default {
  data() {
    return {
      isLogin: true,
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      phoneNumber: '',
      password: '',
      confirmpassword: '',
      errors: {},
      showPage: false,
      isSubmitting: false
    }
  },
  mounted() {
    this.showPage = true;
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.errors = {};
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.age = '';
      this.password = '';
      this.confirmpassword = '';
      this.phoneNumber = '';
      this.isSubmitting = false;
    },

    // In your HomeView.vue methods section
async validateLogin() {
  this.errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!this.email) {
    this.errors.email = "Email is required";
  } else if (!emailRegex.test(this.email)) {
    this.errors.email = "Enter a valid email address";
  }
  if (!this.password) {
    this.errors.password = "Password is required";
  } else if (this.password.length <= 5) {
    this.errors.password = "Password must be more than 5 characters";
  }

  if (Object.keys(this.errors).length === 0) {
    this.isSubmitting = true;
    try {
      // Admin check
      if (
        this.email === "otulajafavour@gmail.com" &&
        this.password === "1234567890"
      ) {
        toast.success('Admin login successful!');
        setTimeout(() => {
          this.$router.push('/admin');
        }, 1000);
        return;
      }
      // Normal user login
      const users = await mockstorage.fetchUsers();
      const user = users.find(
        u => u.email === this.email && u.password === this.password
      );
      if (user) {
        localStorage.setItem('userId', user.id);
        toast.success('Login successful!');
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 1500);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (err) {
      toast.error('Internet Error');
    } finally {
      this.isSubmitting = false;
    }
  }
},
    
    async validateSignUp() {
      this.errors = {};
      const textRegex = /^[A-Za-z\s]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.firstName) {
        this.errors.firstName = "First name is required";
      } else if (!textRegex.test(this.firstName)) {
        this.errors.firstName = "First name must contain only letters";
      }
      if (!this.lastName) {
        this.errors.lastName = "Last name is required";
      } else if (!textRegex.test(this.lastName)) {
        this.errors.lastName = "Last name must contain only letters";
      }
      if (!this.email) {
        this.errors.email = "Email is required";
      } else if (!emailRegex.test(this.email)) {
        this.errors.email = "Enter a valid email address";
      }
      if (!this.age) {
        this.errors.age = "Age is required";
      } else if (isNaN(this.age) || Number(this.age) <= 0) {
        this.errors.age = "Enter a valid age";
      }
      if (!this.password) {
        this.errors.password = "Password is required";
      } else if (this.password.length <= 5) {
        this.errors.password = "Password must be more than 5 characters";
      }
      if (!this.confirmpassword) {
        this.errors.confirmPassword = "Confirm password is required";
      } else if (this.confirmpassword !== this.password) {
        this.errors.confirmPassword = "Passwords do not match";
      }
      if (!this.phoneNumber) {
        this.errors.phoneNumber = "Please enter a phone number";
      } else if (!/^\d{10}$/.test(this.phoneNumber)) {
        this.errors.phoneNumber = "Phone number must be exactly 11 digits";
      }
      if (Object.keys(this.errors).length === 0) {
        this.isSubmitting = true;
        try {
          const users = await mockstorage.fetchUsers();
          const exists = users.some(u => u.email === this.email);
          if (exists) {
            toast.error('Email already exists!');
            return;
          }
          await mockstorage.createUser({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            age: this.age,
            phoneNumber: this.phoneNumber,
            password: this.password,
            role: 'user'
          });
          toast.success('Sign up successful!');
          this.toggleForm();
        } catch (err) {
          toast.error('Error connecting to server');
        } finally {
          this.isSubmitting = false;
        }
      }
    }
  }
}
</script>

<style scoped>
.error-msg{
  color: red;
}
label{
  margin-top: 10px !important;
}
.landingPage{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center !important;
  min-height: 100vh;     
  height: 100vh;          
  box-sizing: border-box;
}
.imageAspect{
  margin-top: 10px;
  width: 50%;
  height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid green;
  border-radius: 30px;
}
.imageAspect img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 30px;
}
.authentications{
  padding: 40px;
  width: 40%;
  max-height: 600px;      
  overflow-y: auto; 
}
.center-btn{
  width: 100% !important;
  padding: 10px 0px;
}
.slide-left-enter-active {
  animation: slideInLeft 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.slide-right-enter-active {
  animation: slideInRight 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@media screen and (max-width: 700px) {
  .landingPage {
    position: relative;
    flex-direction: column;
    align-items: stretch !important;
    min-height: unset;
    height: auto;
    background-image: url('../assets/images/JARIPEO.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .landingPage::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 0;
    pointer-events: none;
  }
  .authentications {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 16px;
    max-height: unset;
    background: rgba(255,255,255,0.95); 
    box-shadow: 0px 0px 10px 0px;
  }
  .imageAspect {
    display: none;
  }
}
</style>