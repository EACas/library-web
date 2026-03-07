async function initAuth(allowedRoles) {
    if (!allowedRoles || !allowedRoles.length) {
        console.error("No roles specified for this page!");
        return;
    }

    try {
        const response = await fetch(`../../php/core/auth.php?roles=${allowedRoles.join(',')}`, {
            credentials: 'same-origin' // important to send session cookie
        });
        const data = await response.json();

        if (!data.success) {
            alert(data.message);
            window.location.href = '../../login.html';
            return;
        }

        window.currentUser = {
            id: data.user_id,
            role: data.role_id,
            f_name: data.f_name,
            l_name: data.l_name
        };

        console.log("User authorized:", window.currentUser);

    } catch (err) {
        console.error("Auth check failed:", err);
    }
}