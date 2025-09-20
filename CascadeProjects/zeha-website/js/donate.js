// Donation form functionality
document.addEventListener('DOMContentLoaded', function() {
    const donationForm = document.getElementById('donationForm');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const paymentInstructions = document.getElementById('paymentInstructions');
    const bankTransferInfo = document.getElementById('bankTransferInfo');
    const mobileMoneyInfo = document.getElementById('mobileMoneyInfo');

    let selectedAmount = 0;

    // Handle preset amount selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set selected amount
            selectedAmount = parseInt(this.dataset.amount);
            
            // Clear custom amount input
            customAmountInput.value = '';
            
            // Update button text if needed
            updateDonateButton();
        });
    });

    // Handle custom amount input
    customAmountInput.addEventListener('input', function() {
        // Remove active class from preset buttons
        amountButtons.forEach(btn => btn.classList.remove('active'));
        
        // Set selected amount
        selectedAmount = parseFloat(this.value) || 0;
        
        // Update button text
        updateDonateButton();
    });

    // Update donate button text with amount
    function updateDonateButton() {
        const submitBtn = document.querySelector('.donate-submit-btn');
        const frequency = document.querySelector('input[name="frequency"]:checked').value;
        
        if (selectedAmount > 0) {
            let frequencyText = '';
            switch(frequency) {
                case 'monthly':
                    frequencyText = '/month';
                    break;
                case 'quarterly':
                    frequencyText = '/quarter';
                    break;
                case 'annually':
                    frequencyText = '/year';
                    break;
                default:
                    frequencyText = '';
            }
            
            submitBtn.innerHTML = `<i class="fas fa-heart"></i> Donate $${selectedAmount}${frequencyText}`;
        } else {
            submitBtn.innerHTML = '<i class="fas fa-heart"></i> Complete Donation';
        }
    }

    // Handle frequency change
    document.querySelectorAll('input[name="frequency"]').forEach(radio => {
        radio.addEventListener('change', updateDonateButton);
    });

    // Form validation
    function validateForm() {
        const requiredFields = ['firstName', 'lastName', 'email'];
        let isValid = true;
        
        // Check if amount is selected
        if (selectedAmount <= 0) {
            alert('Please select or enter a donation amount.');
            return false;
        }
        
        // Check required fields
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Validate email format
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) {
            alert('Please fill in all required fields correctly.');
        }
        
        return isValid;
    }

    // Handle form submission
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(donationForm);
        const paymentMethod = formData.get('paymentMethod');
        
        // Show payment instructions
        showPaymentInstructions(paymentMethod);
        
        // Scroll to payment instructions
        paymentInstructions.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Send confirmation email (simulate)
        sendConfirmationEmail(formData);
    });

    function showPaymentInstructions(paymentMethod) {
        paymentInstructions.style.display = 'block';
        
        if (paymentMethod === 'bank-transfer') {
            bankTransferInfo.style.display = 'block';
            mobileMoneyInfo.style.display = 'none';
        } else {
            bankTransferInfo.style.display = 'none';
            mobileMoneyInfo.style.display = 'block';
        }
    }

    function sendConfirmationEmail(formData) {
        // Simulate sending confirmation email
        const email = formData.get('email');
        const firstName = formData.get('firstName');
        
        // Show success message
        setTimeout(() => {
            alert(`Thank you ${firstName}! A confirmation email with payment instructions has been sent to ${email}.`);
        }, 1000);
        
        // In a real application, this would make an API call to send the email
        console.log('Donation form submitted:', Object.fromEntries(formData));
    }

    // Add ripple effect to amount buttons
    amountButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Real-time form validation
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
                this.classList.add('valid');
            } else {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error') && this.value.trim()) {
                this.classList.remove('error');
            }
        });
    });

    // Initialize button text
    updateDonateButton();
});
