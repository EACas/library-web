<?php
header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$action_id = (int)($_POST["action_id"] ?? 0);
if (!$action_id) {
    echo json_encode(["success" => false, "message" => "Invalid action ID"]);
    exit;
}

// Recalculate fine at time of applying
$result = $conn->query("
    SELECT uba.net_cost, uba.due_date, l.rate_day
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN library l ON u.library_id = l.library_id
    WHERE uba.user_book_action_id = $action_id
    LIMIT 1
");

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Record not found"]);
    exit;
}

$row       = $result->fetch_assoc();
$days_late = max(0, (int)ceil((time() - strtotime($row["due_date"])) / 86400));
$total     = round((float)$row["net_cost"] + ($days_late * (float)$row["rate_day"]), 2);
$now       = date("Y-m-d H:i:s");

$stmt = $conn->prepare("
    UPDATE user_book_actions
    SET status = 3, total_cost = ?, returned_time = ?
    WHERE user_book_action_id = ?
");
$stmt->bind_param("dsi", $total, $now, $action_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Fine of \$$total applied."]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>