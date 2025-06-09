<template>
    <div>
        <section id="contact" class="py-5">
            <div class="container">
                <h2 class="text-center mb-4">Contact Me</h2>
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="contact-info text-white p-4 h-100">
                            <div class="mb-4">
                                <h3 class="h5">Email</h3>
                                <p>samakinbode04@gmail.com</p>
                            </div>
                            <div class="mb-4">
                                <h3 class="h5">Phone</h3>
                                <p>+234 906 175 3627</p>
                            </div>
                            <div class="mb-4">
                                <h3 class="h5">Working Hours</h3>
                                <p>Monday - Friday: 6am - 12am<br>Weekends: 8am - 6pm</p>
                            </div>
                            <div>
                                <h3 class="h5">Social Media</h3>
                                <div class="mt-2">
                                    <a href="https://x.com/Sam_Akinbode?t=o719IKiId-hqUG80GXNqEQ&s=09 " class="text-white me-3"><i class="bi bi-twitter fs-4"></i></a>
                                    <a href="https://www.instagram.com/samakinbode04?igsh=dGRuaWlxem44YXdn " class="text-white"><i class="bi bi-linkedin fs-4"></i></a>
                                    <a href="https://www.facebook.com/share/1RdkRgoUdr/  " class="text-white"><i class="bi bi-linkedin fs-4"></i></a>
sort it out
                                    <a href="https://www.tiktok.com/@tutor.sam5?_t=ZM-8x07QMY9xjS&_r=1 " class="text-white"><i class="bi bi-linkedin fs-4"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card shadow-sm">
                            <div class="card-body p-4">
                                <form action="https://formspree.io/f/xwpozdan" method="POST" id="contact-form"
                                    @submit="onSubmit">
                                    <div class="mb-3">
                                        <label for="contact-name" class="form-label">Your Name</label>
                                        <input type="text" class="form-control" id="contact-name" v-model="name" name="name"
                                            required>
                                        <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="contact-email" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="contact-email" v-model="email" name="email"
                                            required>
                                        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="contact-subject" class="form-label">Subject</label>
                                        <input type="text" class="form-control" id="contact-subject" v-model="subject" name="subject"
                                            required>
                                        <div v-if="errors.subject" class="text-danger">{{ errors.subject }}</div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="contact-message" class="form-label">Message</label>
                                        <textarea class="form-control" id="contact-message" rows="5" v-model="message" name="message"
                                            required></textarea>
                                        <div v-if="errors.message" class="text-danger">{{ errors.message }}</div>
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-primary-custom">Send
                                        Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            email: '',
            subject: '',
            message: '',
            errors: {}
        }
    },


    methods: {
        validateForm() {
            this.errors = {};
            if (!this.name) this.errors.name = "Name is required";
            if (!this.email) this.errors.email = "Email is Required";
            else if (!/\S+@\S+\.\S+/.test(this.email)) this.errors.email = "Email is invalid";
            if (!this.subject) this.errors.subject = "Subject is required";
            if (!this.message) this.errors.message = "Message is required";
            return Object.keys(this.errors).length === 0;

        },

async onSubmit(event) {
        event.preventDefault(); // Always prevent default
        if (!this.validateForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }
        // Prepare form data
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('email', this.email);
        formData.append('subject', this.subject);
        formData.append('message', this.message);

        try {
            const response = await fetch('https://formspree.io/f/xwpozdan', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                alert('Your message has been sent!');
                // Optionally reset the form fields
                this.name = '';
                this.email = '';
                this.subject = '';
                this.message = '';
                this.errors = {};
            } else {
                alert('There was an error sending your message. Please try again later.');
            }
        } catch (error) {
            alert('There was an error sending your message. Please try again later.');
        }
    }
// }




    },


}
</script>

<style scoped>
.contact h2 {
    text-align: center;
    margin-bottom: 2rem;
}

.contact-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.contact-info {
    background-color: var(--primary-color);
    color: white;
    padding: 2rem;
    border-radius: 10px;
}

.info-item {
    margin-bottom: 1.5rem;
}

.info-item h3 {
    margin-bottom: 0.5rem;
}

.contact-form {
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: var(--box-shadow);
}

</style>