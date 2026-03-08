<?php

header("Content-Type: application/json");
require_once "../core/database.php";

$sql = "
SELECT 
    u.user_id,
    u.f_name,
    u.l_name,
    u.email,
    u.user_library_id,
    u.account_status,
    u.date_added,
    r.role
FROM users u
JOIN roles r 
    ON u.role_id = r.role_id
ORDER BY u.l_name, u.f_name
";

$result = $conn->query($sql);

$users = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);

$conn->close();

?>