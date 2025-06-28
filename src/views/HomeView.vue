<template>
  <div class="container-fluid p-4">
    <div class="landingPage">
      <transition name="slide-left">
        <div class="imageAspect" v-if="showPage">
          <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                class="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="../assets/images/jag.jpg" class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src="../assets/images/jay.jpg" class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src="../assets/images/jaj.jpg" class="d-block w-100" alt="..." />
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </transition>

      <transition name="slide-right">
        <div class="authentications" v-if="showPage">
          <h3 class="text-center py-4" v-if="isLogin">Welcome back</h3>
          <h3 class="text-center py-4" v-else>Join Library Management System</h3>
          <div class="loginAspect">
            <template v-if="isLogin">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control form-control-lg"
                id="email"
                placeholder="Enter Email"
                v-model="email"
                @input="validateField('email')"
              />
              <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>

              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control form-control-lg"
                id="password"
                placeholder="Enter Password"
                v-model="password"
                @input="validateField('password')"
              />
              <div v-if="errors.password" class="error-msg">{{ errors.password }}</div>

              <button
                class="btn btn-primary my-4 center-btn"
                @click="validateLogin"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Logging in...' : 'Login' }}
              </button>
              <p class="text-center">
                Don't have an account?
                <span @click="toggleForm" style="color: blue; cursor: pointer">Create account</span>
              </p>
            </template>
            <template v-else>
              <label for="firstName" class="form-label">First Name</label>
              <input
                type="text"
                class="form-control form-control-lg"
                id="firstName"
                placeholder="Enter first name"
                v-model="firstName"
                @input="validateField('firstName')"
              />
              <div v-if="errors.firstName" class="error-msg">{{ errors.firstName }}</div>

              <label for="lastName" class="form-label">Last Name</label>
              <input
                type="text"
                class="form-control form-control-lg"
                id="lastName"
                placeholder="Enter last name"
                v-model="lastName"
                @input="validateField('lastName')"
              />
              <div v-if="errors.lastName" class="error-msg">{{ errors.lastName }}</div>

              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control form-control-lg"
                id="email"
                placeholder="Enter Email"
                v-model="email"
                @input="validateField('email')"
              />
              <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>

              <label for="phoneNumber" class="form-label">Phone Number</label>
              <input
                type="number"
                class="form-control form-control-lg"
                id="phoneNumber"
                placeholder="Enter phone number"
                v-model="phoneNumber"
                @input="validateField('phoneNumber')"
              />
              <div v-if="errors.phoneNumber" class="error-msg">{{ errors.phoneNumber }}</div>

              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control form-control-lg"
                id="password"
                placeholder="Enter Password"
                v-model="password"
                @input="validateField('password')"
              />
              <div v-if="errors.password" class="error-msg">{{ errors.password }}</div>

              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                class="form-control form-control-lg"
                id="confirmPassword"
                placeholder="Confirm Password"
                v-model="confirmpassword"
                @input="validateField('confirmPassword')"
              />
              <div v-if="errors.confirmPassword" class="error-msg">{{ errors.confirmPassword }}</div>

              <button
                class="btn btn-success my-4 center-btn"
                @click="validateSignUp"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Signing up...' : 'Sign Up' }}
              </button>
              <p class="text-center">
                Already have an account?
                <span @click="toggleForm" style="color: blue; cursor: pointer">Login</span>
              </p>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <footer
    class="text-white text-center footer"
    style="background-color: #2c3e50; padding: 40px 0px"
  >
    <div class="container">
      <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
    </div>
  </footer>
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
      phoneNumber: '',
      password: '',
      confirmpassword: '',
      errors: {},
      showPage: false,
      isSubmitting: false,
      debugMode: false, // For debugging authentication issues
    }
  },
  mounted() {
    this.showPage = true
    // Check if already logged in
    const userData = sessionStorage.getItem('userData')
    if (userData) {
      if (this.debugMode) console.log('User already logged in:', JSON.parse(userData))
      this.$router.push('/dashboard')
    }
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin
      this.errors = {}
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.password = ''
      this.confirmpassword = ''
      this.phoneNumber = ''
      this.isSubmitting = false
    },

    validateField(field) {
      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!this.email) {
          this.errors.email = 'Email is required'
        } else if (!emailRegex.test(this.email)) {
          this.errors.email = 'Enter a valid email address'
        } else {
          delete this.errors.email
        }
      }
      if (field === 'password') {
        if (!this.password) {
          this.errors.password = 'Password is required'
        } else if (this.password.length <= 5) {
          this.errors.password = 'Password must be more than 5 characters'
        } else {
          delete this.errors.password
        }
      }
      if (field === 'firstName') {
        if (!this.firstName) {
          this.errors.firstName = 'First name is required'
        } else {
          delete this.errors.firstName
        }
      }
      if (field === 'lastName') {
        if (!this.lastName) {
          this.errors.lastName = 'Last name is required'
        } else {
          delete this.errors.lastName
        }
      }
      if (field === 'phoneNumber') {
        if (!this.phoneNumber) {
          this.errors.phoneNumber = 'Phone number is required'
        } else if (!/^\d{10,}$/.test(this.phoneNumber)) {
          this.errors.phoneNumber = 'Enter a valid phone number'
        } else {
          delete this.errors.phoneNumber
        }
      }
      if (field === 'confirmPassword') {
        if (!this.confirmpassword) {
          this.errors.confirmPassword = 'Confirm your password'
        } else if (this.confirmpassword !== this.password) {
          this.errors.confirmPassword = 'Passwords do not match'
        } else {
          delete this.errors.confirmPassword
        }
      }
    },

    async validateLogin() {
      this.errors = {}
      this.validateField('email')
      this.validateField('password')
      
      if (Object.keys(this.errors).length === 0) {
        this.isSubmitting = true
        try {
          // Admin login check
          if (this.email === 'akinbodetomiwa04@gmail.com' && this.password === 'Sammyzion04') {
            const adminData = {
              id: 'admin_01',
              email: this.email,
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              broughtBooks: [],
              borrowedBooks: [],
              transactionHistory: [],
              comments: [],
              appointments: []
            }
            
            sessionStorage.setItem('userData', JSON.stringify(adminData))
            if (this.debugMode) console.log('Admin login successful:', adminData)

            window.dispatchEvent(new CustomEvent('user-logged-in', {
              detail: adminData
            }))

            toast.success('Admin login successful!')
            setTimeout(() => {
              this.$router.push('/admin')
            }, 1000)
            return
          }

          // Normal user login
          const users = await mockstorage.fetchUsers()
          const user = users.find((u) => u.email === this.email && u.password === this.password)
          
          if (user) {
            const userData = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              role: user.role || 'user',
              broughtBooks: user.broughtBooks || [],
              borrowedBooks: user.borrowedBooks || [],
              transactionHistory: user.transactionHistory || [],
              comments: user.comments || [],
              appointments: user.appointments || []
            }

            sessionStorage.setItem('userData', JSON.stringify(userData))
            if (this.debugMode) console.log('User login successful:', userData)

            window.dispatchEvent(new CustomEvent('user-logged-in', {
              detail: userData
            }))

            toast.success('Login successful!')
            setTimeout(() => {
              this.$router.push('/dashboard')
            }, 1500)
          } else {
            toast.error('Invalid email or password')
            if (this.debugMode) console.log('Login failed: Invalid credentials')
          }
        } catch (err) {
          console.error('Login error:', err)
          toast.error('Connection error. Please try again.')
          if (this.debugMode) console.log('Login error details:', err.message)
        } finally {
          this.isSubmitting = false
        }
      }
    },

    async validateSignUp() {
      this.errors = {}
      this.validateField('firstName')
      this.validateField('lastName')
      this.validateField('email')
      this.validateField('phoneNumber')
      this.validateField('password')
      this.validateField('confirmPassword')

      if (Object.keys(this.errors).length === 0) {
        this.isSubmitting = true
        try {
          const users = await mockstorage.fetchUsers()
          const exists = users.some((u) => u.email === this.email)
          if (exists) {
            toast.error('Email already exists!')
            if (this.debugMode) console.log('Signup failed: Email exists', this.email)
            return
          }

          const newUser = {
            id: `user_${Date.now()}`,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            password: this.password,
            role: 'user',
            broughtBooks: [],
            borrowedBooks: [],
            transactionHistory: [],
            comments: [],
            appointments: []
          }

          await mockstorage.createUser(newUser)
          
          // Automatically log in the user after signup
          sessionStorage.setItem('userData', JSON.stringify(newUser))
          if (this.debugMode) console.log('Signup and auto-login successful:', newUser)

          window.dispatchEvent(new CustomEvent('user-logged-in', {
            detail: newUser
          }))

          toast.success('Sign up successful! You are now logged in.')
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 1500)
        } catch (err) {
          console.error('Signup error:', err)
          toast.error('Error connecting to server')
          if (this.debugMode) console.log('Signup error details:', err.message)
        } finally {
          this.isSubmitting = false
        }
      }
    }
  }
}
</script>

<style scoped>
.error-msg {
  color: red;
}
label {
  margin-top: 10px !important;
}
.landingPage {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center !important;
  min-height: 100vh;
  height: 100vh;
  box-sizing: border-box;
}
.imageAspect {
  margin-top: 10px;
  width: 50%;
  height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
}
.imageAspect img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 30px;
}
.authentications {
  padding: 40px;
  width: 40%;
  max-height: 600px;
  overflow-y: auto;
}
.center-btn {
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
    width: 100%;
  }
  .authentications {
    width: 100%;
    padding: 0;
    overflow: scroll;
  }
  .imageAspect {
    display: none;
  }
  .footer {
    margin: 0px !important;
  }
}
</style>