// Check for password strength
document.getElementById('password').addEventListener('input', function () {
    let password = this.value;
    let strengthMeter = document.getElementById('strengthMeter');
    let feedback = document.getElementById('passwordFeedback');

    if (password.length === 0) {
        strengthMeter.style.width = '0%';
        strengthMeter.style.backgroundColor = '#eee';
        feedback.textContent = 'Enter a password to see strength';
        feedback.style.color = '#777';
        return;
    }

    // Calculate strength
    let strength = 0;

    // Length check
    if (password.length > 6) strength += 20;
    if (password.length > 10) strength += 10;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

    // Pattern checks (reduce strength for common patterns)
    if (/(.)\1\1/.test(password)) strength -= 10; // Repeated characters
    if (/^(12345|qwerty|password|admin).*/i.test(password)) strength -= 20;

    // Ensure minimum strength is 0
    strength = Math.max(0, Math.min(100, strength));

    // Update UI
    strengthMeter.style.width = strength + '%';

    // Color based on strength
    if (strength < 30) {
        strengthMeter.style.backgroundColor = '#e74c3c'; // Weak
        feedback.textContent = 'Weak: Try adding numbers and symbols';
        feedback.style.color = '#e74c3c';
    } else if (strength < 60) {
        strengthMeter.style.backgroundColor = '#f39c12'; // Medium
        feedback.textContent = 'Medium: Consider using a longer password';
        feedback.style.color = '#f39c12';
    } else if (strength < 80) {
        strengthMeter.style.backgroundColor = '#3498db'; // Good
        feedback.textContent = 'Good: Your password has decent strength';
        feedback.style.color = '#3498db';
    } else {
        strengthMeter.style.backgroundColor = '#27ae60'; // Strong
        feedback.textContent = 'Strong: Excellent password strength!';
        feedback.style.color = '#27ae60';
    }
});

// Notify when hash algorithm is selected or changed
document.getElementById('algorithm').addEventListener('change', function () {
    showNotification(`Hash algorithm changed to ${this.value}`, 'info');
});

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash'); // Ubah ke ikon mata tertutup
        showNotification('Password visibility turned ON', 'info');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye'); // Ubah ke ikon mata terbuka
        showNotification('Password visibility turned OFF', 'info');
    }
}

// Hash history storage
let hashHistory = [];

async function hashPassword() {
    let input = document.getElementById("password").value;
    let algorithm = document.getElementById("algorithm").value;

    if (!input) {
        showNotification('Please enter a password to hash', 'error');
        return;
    }

    try {
        // Perform the hashing
        let encoder = new TextEncoder();
        let data = encoder.encode(input);
        let hash = await crypto.subtle.digest(algorithm, data);
        let hashArray = Array.from(new Uint8Array(hash));
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Update the result UI
        const hashResult = document.getElementById('hashResult');
        hashResult.textContent = hashHex;
        hashResult.classList.remove('empty');
        hashResult.classList.add('show');

        // Show copy button
        document.getElementById('copyButton').style.display = 'block';

        // Add to history
        addToHistory(input, hashHex, algorithm);

        // Show notification for success
        showNotification(`Password successfully hashed using ${algorithm}`, 'success');
    } catch (error) {
        showNotification(`Hashing failed: ${error.message}`, 'error');
    }
}

function resetForm() {
    // Reset input password
    document.getElementById('password').value = '';

    // Reset hash result
    document.getElementById('hashResult').textContent = '';
    document.getElementById('hashResult').classList.add('empty');
    document.getElementById('hashResult').classList.remove('show');

    // Hide copy button
    document.getElementById('copyButton').style.display = 'none';

    // Reset strength meter
    const strengthMeter = document.getElementById('strengthMeter');
    strengthMeter.style.width = '0%';
    strengthMeter.style.backgroundColor = '#eee';
    
    // Reset feedback
    const feedback = document.getElementById('passwordFeedback');
    feedback.textContent = 'Enter a password to see strength';
    feedback.style.color = '#777';

    // Show notification
    showNotification('Form has been reset', 'info');
}

function addToHistory(password, hash, algorithm) {
    // Create masked password (show only first and last characters)
    let masked = password.length <= 2 ? '••••' : password[0] + '•'.repeat(password.length - 2) + password[password.length - 1];

    // Add to history array (limit to 5 items)
    hashHistory.unshift({
        password: masked,
        hash: hash,
        algorithm: algorithm,
        timestamp: new Date().toLocaleTimeString()
    });

    if (hashHistory.length > 5) {
        hashHistory.pop();
    }

    // Update history UI
    updateHistoryUI();
}

function updateHistoryUI() {
    const historyBox = document.getElementById('historyBox');

    if (hashHistory.length === 0) {
        historyBox.innerHTML = '<p style="text-align: center; color: #aaa;">No recent hashes</p>';
        return;
    }

    historyBox.innerHTML = '';

    for (let item of hashHistory) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div>
                <strong>${item.password}</strong> 
                <small>(${item.algorithm} at ${item.timestamp})</small>
            </div>
            <div>
                <small>${item.hash.substring(0, 8)}...${item.hash.substring(item.hash.length - 8)}</small>
            </div>
        `;
        historyBox.appendChild(historyItem);
    }
}

function copyToClipboard() {
    const hashResult = document.getElementById('hashResult');
    const text = hashResult.textContent;

    if (!text || text.trim() === 'No hash generated yet') {
        showNotification('No hash available to copy', 'error');
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Hash copied to clipboard!', 'success');
        })
        .catch(err => {
            showNotification('Failed to copy: ' + err.message, 'error');
        });
}

function resetFields() {
    document.getElementById('password').value = '';
    document.getElementById('hashResult').textContent = '';
    document.getElementById('strengthMeter').style.width = '0%';
    document.getElementById('strengthMeter').style.backgroundColor = '#eee';
    document.getElementById('passwordFeedback').textContent = 'Enter a password to see strength';
    document.getElementById('passwordFeedback').style.color = '#777';
    document.getElementById('copyButton').style.display = 'none';

    showNotification('Form has been reset', 'info');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return; // Prevent error if element not found
    
    // Clear existing classes
    notification.className = 'notification';
    
    // Add appropriate type class
    notification.classList.add(type);
    
    // Set the message
    notification.textContent = message;
    
    // Show the notification
    notification.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Attach reset function to reset button
document.getElementById('resetBtn').addEventListener('click', resetFields);