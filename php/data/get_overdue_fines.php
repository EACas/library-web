<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$result = $conn->query("
    SELECT
        uba.user_book_action_id AS action_id,
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        b.book_title,
        uba.due_date,
        DATEDIFF(NOW(), uba.due_date) AS days_late,
        ROUND(DATEDIFF(NOW(), uba.due_date) * l.rate_day, 2) AS fine
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    JOIN library l ON u.library_id = l.library_id
    WHERE uba.status = 1
    AND uba.due_date < NOW()
    ORDER BY days_late DESC
");

$fines = [];
while ($row = $result->fetch_assoc()) $fines[] = $row;

echo json_encode($fines);
$conn->close();
?>