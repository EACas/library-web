<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$result = $conn->query("
    SELECT
        ubr.user_book_reservations AS reservation_id,
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        b.book_title,
        brb.date_reserved,
        ubr.reservation_status
    FROM user_book_reservations ubr
    JOIN users u ON ubr.user_id = u.user_id
    JOIN book_reservation_books brb ON brb.user_book_reservations_id = ubr.user_book_reservations
    JOIN books b ON brb.book_id = b.book_id
    ORDER BY brb.date_reserved DESC
");

$reservations = [];
while ($row = $result->fetch_assoc()) $reservations[] = $row;

echo json_encode($reservations);
$conn->close();
?>