<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$user_id = (int)($_GET["user_id"] ?? 0);
if (!$user_id) {
    echo json_encode(["success" => false, "message" => "Invalid user"]);
    exit;
}

$data = ["success" => true];

// --- PROFILE ---
$stmt = $conn->prepare("
    SELECT f_name, l_name, email, phone_number, user_library_id
    FROM users WHERE user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$data["profile"] = $stmt->get_result()->fetch_assoc();
$stmt->close();

// --- FINES (late records) ---
$stmt = $conn->prepare("
    SELECT
        b.book_title,
        uba.net_cost,
        uba.total_cost,
        uba.status,
        CASE
            WHEN uba.status = 3 THEN DATEDIFF(uba.returned_time, uba.due_date)
            WHEN uba.status = 1 AND uba.due_date < NOW() THEN DATEDIFF(NOW(), uba.due_date)
            ELSE NULL
        END AS days_late
    FROM user_book_actions uba
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    WHERE uba.user_id = ?
    AND uba.status IN (1, 3)
    AND uba.due_date < NOW()
    ORDER BY uba.due_date DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$data["fines"] = [];
while ($row = $result->fetch_assoc()) $data["fines"][] = $row;
$stmt->close();

// --- CURRENTLY BORROWED ---
$stmt = $conn->prepare("
    SELECT
        b.book_title,
        GROUP_CONCAT(DISTINCT a.author_name SEPARATOR ', ') AS authors,
        uba.borrowed_time,
        uba.due_date
    FROM user_book_actions uba
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    LEFT JOIN book_authors ba ON ba.book_id = b.book_id
    LEFT JOIN authors a ON a.author_id = ba.author_id
    WHERE uba.user_id = ? AND uba.status = 1
    GROUP BY uba.user_book_action_id, b.book_title, uba.borrowed_time, uba.due_date
    ORDER BY uba.due_date ASC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$data["current"] = [];
while ($row = $result->fetch_assoc()) $data["current"][] = $row;
$stmt->close();

// --- RESERVATIONS ---
$stmt = $conn->prepare("
    SELECT
        b.book_title,
        brb.date_reserved,
        ubr.reservation_status
    FROM user_book_reservations ubr
    JOIN book_reservation_books brb ON brb.user_book_reservations_id = ubr.user_book_reservations
    JOIN books b ON brb.book_id = b.book_id
    WHERE ubr.user_id = ?
    ORDER BY brb.date_reserved DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$data["reservations"] = [];
while ($row = $result->fetch_assoc()) $data["reservations"][] = $row;
$stmt->close();

// --- BORROWING HISTORY (all records) ---
$stmt = $conn->prepare("
    SELECT
        b.book_title,
        GROUP_CONCAT(DISTINCT a.author_name SEPARATOR ', ') AS authors,
        uba.borrowed_time,
        uba.returned_time,
        uba.status
    FROM user_book_actions uba
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    LEFT JOIN book_authors ba ON ba.book_id = b.book_id
    LEFT JOIN authors a ON a.author_id = ba.author_id
    WHERE uba.user_id = ?
    GROUP BY uba.user_book_action_id, b.book_title, uba.borrowed_time, uba.returned_time, uba.status
    ORDER BY uba.borrowed_time DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$data["history"] = [];
while ($row = $result->fetch_assoc()) $data["history"][] = $row;
$stmt->close();

echo json_encode($data);
$conn->close();
?>