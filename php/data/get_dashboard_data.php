<?php

header("Content-Type: application/json");
require_once "../core/database.php";

$data = [];

// --- STAT CARDS ---

// Total books (sum of stock)
$res = $conn->query("SELECT SUM(stock) AS total FROM books");
$data["total_books"] = (int)$res->fetch_assoc()["total"];

// Currently borrowed
$res = $conn->query("SELECT COUNT(*) AS total FROM user_book_actions WHERE status = 1");
$data["currently_borrowed"] = (int)$res->fetch_assoc()["total"];

// Overdue (borrowed and past due date)
$res = $conn->query("SELECT COUNT(*) AS total FROM user_book_actions WHERE status = 1 AND due_date < NOW()");
$data["overdue_count"] = (int)$res->fetch_assoc()["total"];

// Fine revenue this month (from late/returned-late records)
$res = $conn->query("
    SELECT COALESCE(SUM(total_coast), 0) AS revenue
    FROM user_book_actions
    WHERE status = 3
    AND MONTH(returned_time) = MONTH(NOW())
    AND YEAR(returned_time) = YEAR(NOW())
");
$data["fine_revenue"] = round((float)$res->fetch_assoc()["revenue"], 2);

// --- BOOKS PER GENRE ---
$res = $conn->query("
    SELECT g.genre, COUNT(bg.book_id) AS book_count
    FROM genres g
    LEFT JOIN book_genres bg ON g.genre_id = bg.genre_id
    GROUP BY g.genre_id, g.genre
    ORDER BY book_count DESC
");
$data["books_per_genre"] = [];
$max = 1;
$rows = [];
while ($row = $res->fetch_assoc()) {
    $rows[] = $row;
    if ((int)$row["book_count"] > $max) $max = (int)$row["book_count"];
}
foreach ($rows as $row) {
    $data["books_per_genre"][] = [
        "genre"      => $row["genre"],
        "count"      => (int)$row["book_count"],
        "percentage" => round(((int)$row["book_count"] / $max) * 100)
    ];
}

// --- OVERDUE REPORTS ---
$res = $conn->query("
    SELECT
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        b.book_title,
        uba.due_date,
        DATEDIFF(NOW(), uba.due_date) AS days_late,
        ROUND(DATEDIFF(NOW(), uba.due_date) * l.rate_day, 2) AS fine
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN book_actions_books bab ON bab.user_book_actions__id = uba.user_book_action_id
    JOIN books b ON bab.book_id = b.book_id
    JOIN library l ON u.library_id = l.library_id
    WHERE uba.status = 1 AND uba.due_date < NOW()
    ORDER BY days_late DESC
");
$data["overdue_reports"] = [];
while ($row = $res->fetch_assoc()) {
    $data["overdue_reports"][] = $row;
}

// --- BORROWING TRENDS ---
$res = $conn->query("
    SELECT
        CONCAT(u.f_name, ' ', u.l_name) AS student_name,
        COUNT(uba.user_book_action_id) AS total_borrowed,
        SUM(CASE WHEN uba.status = 2 OR uba.status = 3 THEN 1 ELSE 0 END) AS returned,
        SUM(CASE WHEN uba.status = 1 THEN 1 ELSE 0 END) AS active
    FROM user_book_actions uba
    JOIN users u ON uba.user_id = u.user_id
    JOIN roles r ON u.role_id = r.role_id
    WHERE r.role = 'student'
    GROUP BY u.user_id
    ORDER BY total_borrowed DESC
");
$data["borrowing_trends"] = [];
while ($row = $res->fetch_assoc()) {
    $data["borrowing_trends"][] = $row;
}

echo json_encode($data);
$conn->close();
?>