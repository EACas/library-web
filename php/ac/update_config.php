<?php
header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$body   = json_decode(file_get_contents("php://input"), true);
$action = $body["action"] ?? "";

try {
    if ($action === "library_info") {
        $name    = trim($body["library_name"] ?? "");
        $phone   = trim($body["phone"]        ?? "");
        $email   = trim($body["email"]        ?? "");
        $is_open = (int)($body["is_open"]     ?? 1);

        $stmt = $conn->prepare("
            UPDATE library SET library_name=?, phone=?, email=?, is_open=?
            WHERE library_id = 1
        ");
        $stmt->bind_param("sssi", $name, $phone, $email, $is_open);
        $stmt->execute();
        $stmt->close();
        echo json_encode(["success" => true, "message" => "Library info updated"]);

    } elseif ($action === "borrowing_rules") {
        $max_books = (int)($body["max_books"] ?? 5);
        $rate_day  = (float)($body["rate_day"] ?? 0.5);

        $stmt = $conn->prepare("
            UPDATE library SET allowed_borrowed_books=?, rate_day=?
            WHERE library_id = 1
        ");
        $stmt->bind_param("id", $max_books, $rate_day);
        $stmt->execute();
        $stmt->close();
        echo json_encode(["success" => true, "message" => "Borrowing rules updated"]);

    } elseif ($action === "opening_hours") {
        $from_day   = (int)($body["from_day"]   ?? 1);
        $to_day     = (int)($body["to_day"]     ?? 5);
        $start_hour = (int)($body["start_hour"] ?? 8);
        $end_hour   = (int)($body["end_hour"]   ?? 17);

        // Update from_days and to_day lookup tables, then opening_hours
        $stmt = $conn->prepare("UPDATE from_days SET day_id=? WHERE from_day_id = 1");
        $stmt->bind_param("i", $from_day);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("UPDATE to_day SET day_id=? WHERE to_day_id = 1");
        $stmt->bind_param("i", $to_day);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("
            UPDATE opening_hours SET start_hour=?, end_hour=?
            WHERE library_id = 1
        ");
        $stmt->bind_param("ii", $start_hour, $end_hour);
        $stmt->execute();
        $stmt->close();
        echo json_encode(["success" => true, "message" => "Opening hours updated"]);

    } else {
        echo json_encode(["success" => false, "message" => "Unknown action"]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>