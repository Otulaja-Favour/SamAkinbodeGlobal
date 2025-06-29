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
                <img src="../assets/images/jag.jpg" class="d-block w-100" alt="Library Image 1" />
              </div>
              <div class="carousel-item">
                <img src="../assets/images/jay.jpg" class="d-block w-100" alt="Library Image 2" />
              </div>
              <div class="carousel-item">
                <img src="../assets/images/jaj.jpg" class="d-block w-100" alt="Library Image 3" />
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
            <!-- Login Form -->
            <template v-if="isLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="email"
                  placeholder="Enter Email"
                  v-model="email"
                  @input="validateField('email')"
                  :class="{ 'is-invalid': errors.email }"
                />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  id="password"
                  placeholder="Enter Password"
                  v-model="password"
                  @input="validateField('password')"
                  :class="{ 'is-invalid': errors.password }"
                />
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>

              <button
                class="btn btn-primary my-4 center-btn"
                @click="validateLogin"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isSubmitting ? 'Logging in...' : 'Login' }}
              </button>

              <p class="text-center">
                Don't have an account?
                <span @click="toggleForm" class="text-primary cursor-pointer">Create account</span>
              </p>
            </template>

            <!-- Signup Form -->
            <template v-else>
              <div class="mb-3">
                <label for="firstName" class="form-label">First Name</label>
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="firstName"
                  placeholder="Enter first name"
                  v-model="firstName"
                  @input="validateField('firstName')"
                  :class="{ 'is-invalid': errors.firstName }"
                />
                <div v-if="errors.firstName" class="invalid-feedback">{{ errors.firstName }}</div>
              </div>

              <div class="mb-3">
                <label for="lastName" class="form-label">Last Name</label>
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="lastName"
                  placeholder="Enter last name"
                  v-model="lastName"
                  @input="validateField('lastName')"
                  :class="{ 'is-invalid': errors.lastName }"
                />
                <div v-if="errors.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
              </div>

              <div class="mb-3">
                <label for="signupEmail" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="signupEmail"
                  placeholder="Enter Email"
                  v-model="email"
                  @input="validateField('email')"
                  :class="{ 'is-invalid': errors.email }"
                />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <input
                  type="tel"
                  class="form-control form-control-lg"
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  v-model="phoneNumber"
                  @input="validateField('phoneNumber')"
                  :class="{ 'is-invalid': errors.phoneNumber }"
                />
                <div v-if="errors.phoneNumber" class="invalid-feedback">{{ errors.phoneNumber }}</div>
              </div>

              <div class="mb-3">
                <label for="signupPassword" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  id="signupPassword"
                  placeholder="Enter Password"
                  v-model="password"
                  @input="validateField('password')"
                  :class="{ 'is-invalid': errors.password }"
                />
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  v-model="confirmPassword"
                  @input="validateField('confirmPassword')"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                />
                <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
              </div>

              <button
                class="btn btn-success my-4 center-btn"
                @click="validateSignUp"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isSubmitting ? 'Signing up...' : 'Sign Up' }}
              </button>

              <p class="text-center">
                Already have an account?
                <span @click="toggleForm" class="text-primary cursor-pointer">Login</span>
              </p>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </div>

  <footer class="text-white text-center footer bg-dark">
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
  name: 'HomeView',
  
  data() {
    return {
      isLogin: true,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      errors: {},
      showPage: false,
      isSubmitting: false,
      debugMode: process.env.NODE_ENV === 'development'
    }
  },

  async mounted() {
    this.showPage = true
    
    // Check if already logged in
    const userData = sessionStorage.getItem('userData')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        if (this.debugMode) console.log('User already logged in:', user)
        
        // Redirect based on role
        if (user.role === 'admin') {
          this.$router.push('/admin')
        } else {
          this.$router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        sessionStorage.removeItem('userData')
      }
    }

    // Initialize database connection
    try {
      await mockstorage.initDb()
      if (this.debugMode) console.log('Database connection initialized')
    } catch (error) {
      console.error('Database initialization failed:', error)
      toast.error('Connection to server failed. Please try again later.')
    }
  },

  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin
      this.clearForm()
    },

    clearForm() {
      this.errors = {}
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.password = ''
      this.confirmPassword = ''
      this.phoneNumber = ''
      this.isSubmitting = false
    },

    validateField(field) {
      // Clear previous error for this field
      if (this.errors[field]) {
        delete this.errors[field]
      }

      switch (field) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!this.email.trim()) {
            this.errors.email = 'Email is required'
          } else if (!emailRegex.test(this.email.trim())) {
            this.errors.email = 'Enter a valid email address'
          }
          break

        case 'password':
          if (!this.password) {
            this.errors.password = 'Password is required'
          } else if (this.password.length < 6) {
            this.errors.password = 'Password must be at least 6 characters'
          }
          break

        case 'firstName':
          if (!this.firstName.trim()) {
            this.errors.firstName = 'First name is required'
          } else if (this.firstName.trim().length < 2) {
            this.errors.firstName = 'First name must be at least 2 characters'
          }
          break

        case 'lastName':
          if (!this.lastName.trim()) {
            this.errors.lastName = 'Last name is required'
          } else if (this.lastName.trim().length < 2) {
            this.errors.lastName = 'Last name must be at least 2 characters'
          }
          break

        case 'phoneNumber':
          const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
          if (!this.phoneNumber.trim()) {
            this.errors.phoneNumber = 'Phone number is required'
          } else if (!phoneRegex.test(this.phoneNumber.trim())) {
            this.errors.phoneNumber = 'Enter a valid phone number'
          }
          break

        case 'confirmPassword':
          if (!this.confirmPassword) {
            this.errors.confirmPassword = 'Please confirm your password'
          } else if (this.confirmPassword !== this.password) {
            this.errors.confirmPassword = 'Passwords do not match'
          }
          break
      }
    },

    validateAllFields(isSignup = false) {
      this.validateField('email')
      this.validateField('password')
      
      if (isSignup) {
        this.validateField('firstName')
        this.validateField('lastName')
        this.validateField('phoneNumber')
        this.validateField('confirmPassword')
      }
      
      return Object.keys(this.errors).length === 0
    },

    async validateLogin() {
      if (!this.validateAllFields(false)) {
        toast.error('Please fix the errors before submitting')
        return
      }

      this.isSubmitting = true
      
      try {
        // Admin login check
        if (this.email.trim() === 'akinbodetomiwa04@gmail.com' && this.password === 'Sammyzion04') {
          const adminData = {
            id: 'admin_01',
            email: this.email.trim(),
            firstName: 'Sam',
            lastName: 'Akinbode',
            role: 'admin',
            broughtBooks: [],
            borrowedBooks: [],
            transactionHistory: [],
            comments: [],
            appointments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          // Store admin data
          sessionStorage.setItem('userData', JSON.stringify(adminData))
          sessionStorage.setItem('userId', adminData.id)
          sessionStorage.setItem('adminEmail', adminData.email)
          
          // Dispatch login event
          window.dispatchEvent(new CustomEvent('user-logged-in', {
            detail: adminData
          }))
          
          toast.success('Admin login successful!')
          
          setTimeout(() => {
            this.$router.push('/admin')
          }, 1000)
          return
        }

        // Regular user login
        const users = await mockstorage.fetchUsers()
        const user = users.find((u) => 
          u.email?.toLowerCase() === this.email.trim().toLowerCase() && 
          u.password === this.password
        )
        
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
            appointments: user.appointments || [],
            cart: user.cart || [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
          
          // Store user data
          sessionStorage.setItem('userData', JSON.stringify(userData))
          sessionStorage.setItem('userId', userData.id)
          
          // Dispatch login event
          window.dispatchEvent(new CustomEvent('user-logged-in', {
            detail: userData
          }))
          
          toast.success('Login successful!')
          
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 1000)
        } else {
          toast.error('Invalid email or password')
        }
      } catch (error) {
        console.error('Login error:', error)
        toast.error('Connection error. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },

    async validateSignUp() {
      if (!this.validateAllFields(true)) {
        toast.error('Please fix the errors before submitting')
        return
      }

      this.isSubmitting = true
      
      try {
        // Check if user already exists
        const users = await mockstorage.fetchUsers()
        const existingUser = users.find((u) => 
          u.email?.toLowerCase() === this.email.trim().toLowerCase()
        )
        
        if (existingUser) {
          toast.error('An account with this email already exists!')
          return
        }

        // Create new user
        const newUser = {
          firstName: this.firstName.trim(),
          lastName: this.lastName.trim(),
          email: this.email.trim().toLowerCase(),
          phoneNumber: this.phoneNumber.trim(),
          password: this.password,
          role: 'user'
        }

        const createdUser = await mockstorage.createUser(newUser)
        
        if (createdUser) {
          toast.success('Account created successfully!')
          
          // Auto-login after successful signup
          const userData = {
            id: createdUser.id,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            phoneNumber: createdUser.phoneNumber,
            role: createdUser.role,
            broughtBooks: createdUser.broughtBooks || [],
            borrowedBooks: createdUser.borrowedBooks || [],
            transactionHistory: createdUser.transactionHistory || [],
            comments: createdUser.comments || [],
            appointments: createdUser.appointments || [],
            cart: createdUser.cart || [],
            createdAt: createdUser.createdAt,
            updatedAt: createdUser.updatedAt
          }
          
          // Store user data
          sessionStorage.setItem('userData', JSON.stringify(userData))
          sessionStorage.setItem('userId', userData.id)
          
          // Dispatch login event
          window.dispatchEvent(new CustomEvent('user-logged-in', {
            detail: userData
          }))
          
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 1500)
        }
      } catch (error) {
        console.error('Signup error:', error)
        toast.error('Failed to create account. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  text-decoration: underline;
}

.landingPage {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center !important;
  min-height: 100vh;
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
  padding: 12px 0px;
  font-weight: 600;
}

.footer {
  padding: 40px 0px;
  margin-top: auto;
}

/* Animations */
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

/* Form styling */
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.invalid-feedback {
  display: block;
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: #dc3545;
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .landingPage {
    flex-direction: column;
    padding: 20px;
  }
  
  .authentications {
    width: 100%;
    padding: 20px;
    max-height: none;
  }
  
  .imageAspect {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }
}

@media screen and (max-width: 576px) {
  .authentications {
    padding: 15px;
  }
  
  .imageAspect {
    height: 250px;
  }
}
</style>
