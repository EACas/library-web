<?php
header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$student_id = (int)($_POST["student_id"] ?? 0);
$book_id    = (int)($_POST["book_id"]    ?? 0);
$type       = $_POST["type"]             ?? "";
$due_date   = $_POST["due_date"]         ?? "";

if (!$student_id || !$book_id || !in_array($type, ["borrow", "return"])) {
    echo json_encode(["success" => false, "message" => "Invalid parameters"]);
    exit;
}

// Get library rate
$rate_res = $conn->query("SELECT rate_day, allowed_borrowed_books FROM library WHERE library_id = 1");
$library  = $rate_res->fetch_assoc();
$rate_day = (float)$library["rate_day"];
$max_books = (int)$library["allowed_borrowed_books"];

$conn->begin_transaction();

try {
    if ($type === "borrow") {
        if (empty($due_date)) throw new Exception("Due date is required");

        // Check student hasn't exceeded borrow limit
        $check = $conn->query("
            SELECT COUNT(*) AS cnt FROM user_book_actions
            WHERE user_id = $student_id AND status = 1
        ");
        $cnt = (int)$check->fetch_assoc()["cnt"];
        if ($cnt >= $max_books) throw new Exception("Student has reached the borrowing limit ($max_books books)");

        // Check stock
        $stock_res = $conn->query("SELECT stock FROM books WHERE book_id = $book_id");
        $stock     = (int)$stock_res->fetch_assoc()["stock"];
        if ($stock < 1) throw new Exception("Book is out of stock");

        // Calculate net cost (days * rate)
        $days     = max(1, (int)ceil((strtotime($due_date) - time()) / 86400));
        $net_cost = round($days * $rate_day, 2);

        // Insert into user_book_actions
        $now  = date("Y-m-d H:i:s");
        $stmt = $conn->prepare("
            INSERT INTO user_book_actions
                (user_id, borrowed_time, action, due_date, net_cost, status)
            VALUES (?, ?, 1, ?, ?, 1)
        ");
        $stmt->bind_param("issd", $student_id, $now, $due_date, $net_cost);
        $stmt->execute();
        $action_id = $conn->insert_id;
        $stmt->close();

        // Insert into book_actions_books
        $condition_id = 1; // default: New
        $stmt = $conn->prepare("
            INSERT INTO book_actions_books (user_book_actions__id, book_id, book_condition_id)
            VALUES (?, ?, ?)
        ");
        $stmt->bind_param("iii", $action_id, $book_id, $condition_id);
        $stmt->execute();
        $stmt->close();

        // Reduce stock
        $conn->query("UPDATE books SET stock = stock - 1 WHERE book_id = $book_id");

        $conn->commit();
        echo json_encode(["success" => true, "message" => "Book borrowed successfully. Due: $due_date"]);

    } else {
        // RETURN — find the active borrow record
        $stmt = $conn->prepare("
            SELECT uba.user_book_action_id, uba.due_date, uba.net_cost
            FROM user_book_actions uba
            JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
            WHERE uba.user_id = ? AND bab.book_id = ? AND uba.status = 1
            LIMIT 1
        ");
        $stmt->bind_param("ii", $student_id, $book_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) throw new Exception("No active borrow record found for this student and book");

        $record    = $result->fetch_assoc();
        $action_id = $record["user_book_action_id"];
        $now       = date("Y-m-d H:i:s");
        $due       = strtotime($record["due_date"]);
        $days_late = max(0, (int)ceil((time() - $due) / 86400));
        $is_late   = $days_late > 0;
        $total     = round($record["net_cost"] + ($days_late * $rate_day), 2);
        $status    = $is_late ? 3 : 2; // 3=Late, 2=Returned

        $stmt = $conn->prepare("
            UPDATE user_book_actions
            SET status = ?, returned_time = ?, total_coast = ?, action = 2
            WHERE user_book_action_id = ?
        ");
        $stmt->bind_param("isdi", $status, $now, $total, $action_id);
        $stmt->execute();
        $stmt->close();

        // Restore stock
        $conn->query("UPDATE books SET stock = stock + 1 WHERE book_id = $book_id");

        $conn->commit();
        $msg = $is_late
            ? "Book returned. $days_late day(s) late — fine: \$$total"
            : "Book returned successfully. No fine.";
        echo json_encode(["success" => true, "message" => $msg]);
    }

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>