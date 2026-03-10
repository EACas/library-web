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

// Get library settings
$lib      = $conn->query("SELECT rate_day, allowed_borrowed_books FROM library WHERE library_id = 1")->fetch_assoc();
$rate_day = (float)$lib["rate_day"];
$max      = (int)$lib["allowed_borrowed_books"];

// Check borrow limit
$cnt = (int)$conn->query("
    SELECT COUNT(*) AS cnt FROM user_book_actions
    WHERE user_id = $student_id AND status = 1
")->fetch_assoc()["cnt"];
if ($cnt >= $max) {
    echo json_encode(["success" => false, "message" => "You have reached your borrowing limit ($max books)."]);
    exit;
}

// Check stock
$stock = (int)$conn->query("SELECT stock FROM books WHERE book_id = $book_id")->fetch_assoc()["stock"];
if ($stock < 1) {
    echo json_encode(["success" => false, "message" => "This book is out of stock."]);
    exit;
}

// Default 14-day loan
$due_date = date("Y-m-d", strtotime("+14 days"));
$net_cost = round(14 * $rate_day, 2);
$now      = date("Y-m-d H:i:s");

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("
        INSERT INTO user_book_actions (user_id, borrowed_time, action, due_date, net_cost, status)
        VALUES (?, ?, 1, ?, ?, 1)
    ");
    $stmt->bind_param("issd", $student_id, $now, $due_date, $net_cost);
    $stmt->execute();
    $action_id = $conn->insert_id;
    $stmt->close();

    $condition_id = 1;
    $stmt = $conn->prepare("
        INSERT INTO book_actions_books (user_book_actions__id, book_id, book_condition_id)
        VALUES (?, ?, ?)
    ");
    $stmt->bind_param("iii", $action_id, $book_id, $condition_id);
    $stmt->execute();
    $stmt->close();

    $conn->query("UPDATE books SET stock = stock - 1 WHERE book_id = $book_id");

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Book borrowed successfully! Due date: $due_date"]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>