<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$data = [];

// Library settings
$res = $conn->query("SELECT * FROM library WHERE library_id = 1");
$data["library"] = $res->fetch_assoc();

// Opening hours
$res = $conn->query("
    SELECT oh.start_hour, oh.end_hour,
           fd.day_id AS from_day,
           td.day_id AS to_day
    FROM opening_hours oh
    JOIN from_days fd ON oh.from_day = fd.from_day_id
    JOIN to_day    td ON oh.to_day   = td.to_day_id
    WHERE oh.library_id = 1
    LIMIT 1
");
$data["hours"] = $res->fetch_assoc() ?? ["from_day" => 1, "to_day" => 5, "start_hour" => 8, "end_hour" => 17];

// Activity logs
$res = $conn->query("
    SELECT
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        b.book_title,
        uba.borrowed_time,
        uba.due_date,
        uba.total_coast,
        uba.status
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    ORDER BY uba.borrowed_time DESC
    LIMIT 50
");
$data["logs"] = [];
while ($row = $res->fetch_assoc()) {
    $data["logs"][] = $row;
}

echo json_encode($data);
$conn->close();
?>