<template>
  <div class="container-fluid">
    <div class="landingPage">
      <div class="imageAspect">
        <img src="../assets/images/JARIPEO.jpeg" alt="">
      </div>
      <div class="authentications">
        <h3 v-if="isLogin">Login into your dashboard</h3>
        <h3 v-else>Sign up for an account</h3>
        <div class="loginAspect">
          <template v-if="isLogin">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter Email" v-model="email">
            <div v-if="errors.email" class="error-msg">
              {{ errors.email }}
            </div>

            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter Password" v-model="password">
            <div v-if="errors.password" class="error-msg">
              {{ errors.password }}
            </div>
            <button @click="validateLogin">Login</button>
            <p>Don't have an account? <span @click="toggleForm" style="color:blue;cursor:pointer;">Create account</span></p>
          </template>
          <template v-else>
            <label for="FirstName">First Name</label>
            <input type="text" id="FirstName" placeholder="Enter first name" v-model="firstName">
            <div v-if="errors.firstName" class="error-msg">
              {{ errors.firstName }}
            </div>

            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Enter last name" v-model="lastName">
            <div v-if="errors.lastName" class="error-msg">
              {{ errors.lastName }}
            </div>

            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter Email" v-model="email">
            <div v-if="errors.email" class="error-msg">
              {{ errors.email }}
            </div>

            <label for="age">Age</label>
            <input type="number" id="age" placeholder="Enter age" v-model="age">
            <div v-if="errors.age" class="error-msg">
              {{ errors.age }}
            </div>

            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter Password" v-model="password">
            <div v-if="errors.password" class="error-msg">
              {{ errors.password }}
            </div>

            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Confirm Password" v-model="confirmpassword">
            <div v-if="errors.confirmPassword" class="error-msg">
              {{ errors.confirmPassword }}
            </div>

            <button @click="validateSignUp">Sign Up</button>
            <p>Already have an account? <span @click="toggleForm" style="color:blue;cursor:pointer;">Login</span></p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: true,
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      password: '',
      confirmpassword: '',
      errors: {}
    }
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
    },
    validateLogin() {
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
    },
    validateSignUp() {
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
    }
  }
}
</script>