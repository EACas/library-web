<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$data = [];

// Total transactions this month
$res = $conn->query("
    SELECT COUNT(*) AS total FROM user_book_actions
    WHERE MONTH(borrowed_time) = MONTH(NOW())
    AND YEAR(borrowed_time) = YEAR(NOW())
");
$data["total_transactions"] = (int)$res->fetch_assoc()["total"];

// Currently overdue
$res = $conn->query("
    SELECT COUNT(*) AS total FROM user_book_actions
    WHERE status = 1 AND due_date < NOW()
");
$data["overdue_count"] = (int)$res->fetch_assoc()["total"];

// Fine revenue this month (late returns)
$res = $conn->query("
    SELECT COALESCE(SUM(total_cost), 0) AS revenue
    FROM user_book_actions
    WHERE status = 3
    AND MONTH(returned_time) = MONTH(NOW())
    AND YEAR(returned_time) = YEAR(NOW())
");
$data["fine_revenue"] = round((float)$res->fetch_assoc()["revenue"], 2);

echo json_encode($data);
$conn->close();
?>