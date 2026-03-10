<?php
header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$user_id  = (int)($_POST["user_id"]  ?? 0);
$password = $_POST["password"] ?? "";

if (!$user_id || !$password) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters"]);
    exit;
}

$hashed = password_hash($password, PASSWORD_BCRYPT);
$stmt   = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
$stmt->bind_param("si", $hashed, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Password updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>