<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$type  = $_GET["type"]  ?? "all";
$month = $_GET["month"] ?? date("Y-m");

// Parse month
$parts = explode("-", $month);
$year  = (int)($parts[0] ?? date("Y"));
$mon   = (int)($parts[1] ?? date("m"));

// Build status filter
$statusFilter = "";
switch ($type) {
    case "borrowed": $statusFilter = "AND uba.status = 1"; break;
    case "returned": $statusFilter = "AND uba.status = 2"; break;
    case "late":     $statusFilter = "AND uba.status = 3"; break;
    case "overdue":  $statusFilter = "AND uba.status = 1 AND uba.due_date < NOW()"; break;
    default:         $statusFilter = ""; break;
}

// For overdue, don't filter by month since they may be from any month
$monthFilter = ($type === "overdue")
    ? ""
    : "AND MONTH(uba.borrowed_time) = $mon AND YEAR(uba.borrowed_time) = $year";

$result = $conn->query("
    SELECT
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        u.user_library_id,
        b.book_title,
        uba.borrowed_time,
        uba.due_date,
        uba.returned_time,
        uba.total_cost,
        uba.status
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    WHERE 1=1
    $monthFilter
    $statusFilter
    ORDER BY uba.borrowed_time DESC
");

$records = [];
while ($row = $result->fetch_assoc()) $records[] = $row;

echo json_encode(["success" => true, "records" => $records]);
$conn->close();
?>