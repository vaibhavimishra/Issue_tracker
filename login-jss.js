document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Perform authentication
    // Replace the if condition with your authentication logic
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true'); // Set authentication state
      window.location.replace('index.html'); // Redirect to index.html
    } else {
      alert('Invalid username or password'); // Show error message
    }
  });
  