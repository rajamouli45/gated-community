// This file is currently empty as all login handling is done in individual HTML files
// Future shared JavaScript functionality can be added here 

// Common utility functions
const utils = {
    // Form validation
    validateForm: (formData) => {
        for (let [key, value] of formData.entries()) {
            if (!value.trim()) {
                return false;
            }
        }
        return true;
    },

    // Show error message
    showError: (elementId, message) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    },

    // Hide error message
    hideError: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    },

    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Authentication functions
const auth = {
    // Check if user is logged in
    isLoggedIn: () => {
        return localStorage.getItem('user') !== null;
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
};

// Dashboard functions
const dashboard = {
    // Toggle section visibility
    toggleSection: (sectionId) => {
        const sections = document.querySelectorAll('.section-content');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },

    // Update dashboard stats
    updateStats: (stats) => {
        Object.entries(stats).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = value;
            }
        });
    }
};

// Utility Bill Payment Functions
const utilityBills = {
    // Initialize utility bills data
    initializeBills: () => {
        if (!localStorage.getItem('utilityBills')) {
            localStorage.setItem('utilityBills', JSON.stringify([]));
        }
    },

    // Add new utility bill payment
    addBillPayment: (billData) => {
        const bills = JSON.parse(localStorage.getItem('utilityBills') || '[]');
        const newBill = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...billData
        };
        bills.push(newBill);
        localStorage.setItem('utilityBills', JSON.stringify(bills));
        return newBill;
    },

    // Get bill payment history
    getBillHistory: () => {
        return JSON.parse(localStorage.getItem('utilityBills') || '[]');
    },

    // Update bill status to paid
    markBillAsPaid: (billId) => {
        let bills = JSON.parse(localStorage.getItem('utilityBills') || '[]');
        const billIndex = bills.findIndex(bill => bill.id == billId);
        if (billIndex !== -1) {
            bills[billIndex].status = 'paid';
            bills[billIndex].action = 'Paid';
            bills[billIndex].paymentDate = new Date().toISOString();
            localStorage.setItem('utilityBills', JSON.stringify(bills));
            return true;
        }
        return false;
    },

    // Validate bill payment data
    validateBillData: (billType, accountNumber, amount) => {
        if (!billType || !accountNumber || !amount) {
            return false;
        }
        if (isNaN(amount) || amount <= 0) {
            return false;
        }
        return true;
    }
};

// Handle utility bill payment form submission
document.addEventListener('DOMContentLoaded', () => {
    const utilityBillForm = document.getElementById('utilityBillForm');
    if (utilityBillForm) {
        utilityBillForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const billType = document.getElementById('billType').value;
            if (!billType) {
                utils.showError('paymentError', 'Please select a bill type');
                return;
            }

            let accountNumber, amount;
            switch (billType) {
                case 'electricity':
                    accountNumber = document.getElementById('electricityAccount').value;
                    amount = document.getElementById('electricityAmount').value;
                    break;
                case 'gas':
                    accountNumber = document.getElementById('gasAccount').value;
                    amount = document.getElementById('gasAmount').value;
                    break;
                case 'water':
                    accountNumber = document.getElementById('waterAccount').value;
                    amount = document.getElementById('waterAmount').value;
                    break;
            }

            if (!utilityBills.validateBillData(billType, accountNumber, amount)) {
                utils.showError('paymentError', 'Please fill in all required fields with valid values');
                return;
            }

            const billData = {
                type: billType,
                accountNumber,
                amount: parseFloat(amount),
                status: 'pending',
                customerId: auth.getCurrentUser()?.username || 'guest'
            };

            try {
                const newBill = utilityBills.addBillPayment(billData);
                // Show success message
                alert('Bill payment initiated successfully!');
                // Reset form
                utilityBillForm.reset();
                document.querySelectorAll('.utility-details').forEach(detail => {
                    detail.classList.remove('active');
                });
                utils.hideError('paymentError');
            } catch (error) {
                utils.showError('paymentError', 'Failed to process payment. Please try again.');
            }
        });
    }

    // Initialize utility bills
    utilityBills.initializeBills();
});

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add logout event listener if logout button exists
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    }

    // Add section toggle listeners
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            dashboard.toggleSection(sectionId);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});

// Initialize customer data
function initializeCustomerData() {
    // Don't clear existing customer data; only initialize if not present
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify([]));
        console.log('Customers data initialized as empty in localStorage.');
    } else {
        console.log('Customers data already exists in localStorage. Not initializing.');
    }
}

// Function to load customer data
// ... existing code ... 