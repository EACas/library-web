<?php
header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$user_id   = (int)($_POST["user_id"] ?? 0);
$new_status = (int)($_POST["status"]  ?? 0);

if (!$user_id || !in_array($new_status, [1, 2, 3])) {
    echo json_encode(["success" => false, "message" => "Invalid parameters"]);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET account_status = ? WHERE user_id = ?");
$stmt->bind_param("ii", $new_status, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>