<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$result = $conn->query("
    SELECT
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        u.user_library_id,
        b.book_title,
        uba.borrowed_time,
        uba.due_date
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    WHERE uba.status = 1
    ORDER BY uba.due_date ASC
");

$borrowed = [];
while ($row = $result->fetch_assoc()) $borrowed[] = $row;

echo json_encode($borrowed);
$conn->close();
?>