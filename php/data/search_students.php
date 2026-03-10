<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$q = trim($_GET["q"] ?? "");
if (empty($q)) { echo json_encode([]); exit; }

$like = "%" . $conn->real_escape_string($q) . "%";

$result = $conn->query("
    SELECT u.user_id, u.f_name, u.l_name, u.user_library_id
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE r.role = 'student'
    AND u.account_status = 1
    AND (u.f_name LIKE '$like' OR u.l_name LIKE '$like'
         OR CONCAT(u.f_name, ' ', u.l_name) LIKE '$like'
         OR u.user_library_id LIKE '$like')
");

$students = [];
while ($row = $result->fetch_assoc()) $students[] = $row;

echo json_encode($students);
$conn->close();
?>