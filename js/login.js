document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('php/core/login.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Save user info in sessionStorage so JS pages can access it if needed
            sessionStorage.setItem('user', JSON.stringify({
                user_id: data.user_id,
                role_id: data.role_id,
                f_name: data.f_name,
                l_name: data.l_name
            }));

            // Redirect based on role
            switch (data.role_id) {
                case 1: // Admin
                    window.location.href = 'pages/admin/admin_dashboard.html';
                    break;
                case 2: // Librarian
                    window.location.href = 'pages/librarian/librarian_books.html';
                    break;
                case 3: // Student
                    window.location.href = 'pages/student/student_library.html';
                    break;
                default:
                    alert('Unknown role, cannot redirect');
            }
        } else {
            alert(data.message || 'Login failed. Check your credentials.');
        }

    } catch (err) {
        console.error('Login error:', err);
        alert('An error occurred while logging in.');
    }
});