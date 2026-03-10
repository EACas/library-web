<?php
header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$reservation_id = (int)($_POST["reservation_id"] ?? 0);
$status         = (int)($_POST["status"]         ?? -1);

if (!$reservation_id || !in_array($status, [1, 2])) {
    echo json_encode(["success" => false, "message" => "Invalid parameters"]);
    exit;
}

$stmt = $conn->prepare("UPDATE user_book_reservations SET reservation_status = ? WHERE user_book_reservations = ?");
$stmt->bind_param("ii", $status, $reservation_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>