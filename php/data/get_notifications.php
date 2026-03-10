<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$data = [];

// --- DUE DATE REMINDERS (due within 2 days, not yet returned) ---
$res = $conn->query("
    SELECT
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        b.book_title,
        uba.due_date,
        DATEDIFF(uba.due_date, NOW()) AS days_until_due
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    WHERE uba.status = 1
    AND uba.due_date >= NOW()
    AND DATEDIFF(uba.due_date, NOW()) <= 2
    ORDER BY uba.due_date ASC
");
$data["reminders"] = [];
while ($row = $res->fetch_assoc()) $data["reminders"][] = $row;

// --- RESERVED BOOK AVAILABLE (approved reservations where stock > 0) ---
$res = $conn->query("
    SELECT
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        b.book_title,
        brb.date_reserved
    FROM user_book_reservations ubr
    JOIN users u ON ubr.user_id = u.user_id
    JOIN book_reservation_books brb ON brb.user_book_reservations_id = ubr.user_book_reservations
    JOIN books b ON brb.book_id = b.book_id
    WHERE ubr.reservation_status = 1
    AND b.stock > 0
    ORDER BY brb.date_reserved DESC
");
$data["available"] = [];
while ($row = $res->fetch_assoc()) $data["available"][] = $row;

// --- OVERDUE NOTICES ---
$res = $conn->query("
    SELECT
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        b.book_title,
        uba.due_date,
        DATEDIFF(NOW(), uba.due_date) AS days_late
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    WHERE uba.status = 1
    AND uba.due_date < NOW()
    ORDER BY days_late DESC
");
$data["overdue"] = [];
while ($row = $res->fetch_assoc()) $data["overdue"][] = $row;

echo json_encode($data);
$conn->close();
?>