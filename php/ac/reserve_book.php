<?php
header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$student_id = (int)($_POST["student_id"] ?? 0);
$book_id    = (int)($_POST["book_id"]    ?? 0);

if (!$student_id || !$book_id) {
    echo json_encode(["success" => false, "message" => "Invalid parameters"]);
    exit;
}

// Check if already reserved by this student
$check = $conn->prepare("
    SELECT ubr.user_book_reservations
    FROM user_book_reservations ubr
    JOIN book_reservation_books brb ON brb.user_book_reservations_id = ubr.user_book_reservations
    WHERE ubr.user_id = ? AND brb.book_id = ? AND ubr.reservation_status IN (0, 1)
");
$check->bind_param("ii", $student_id, $book_id);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "You already have an active reservation for this book."]);
    $check->close();
    exit;
}
$check->close();

$conn->begin_transaction();

try {
    // Insert reservation
    $cost = 0.0;
    $stmt = $conn->prepare("
        INSERT INTO user_book_reservations (user_id, reservation_cost, reservation_status)
        VALUES (?, ?, 0)
    ");
    $stmt->bind_param("id", $student_id, $cost);
    $stmt->execute();
    $reservation_id = $conn->insert_id;
    $stmt->close();

    // Link book to reservation
    $now  = date("Y-m-d H:i:s");
    $stmt = $conn->prepare("
        INSERT INTO book_reservation_books (date_reserved, user_book_reservations_id, book_id)
        VALUES (?, ?, ?)
    ");
    $stmt->bind_param("sii", $now, $reservation_id, $book_id);
    $stmt->execute();
    $stmt->close();

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Reservation submitted. Awaiting librarian approval."]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>