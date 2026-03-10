<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$q        = trim($_GET["q"]        ?? "");
$genre_id = (int)($_GET["genre_id"] ?? 0);

$where  = ["1=1"];
$params = [];
$types  = "";

if ($q) {
    $like     = "%" . $conn->real_escape_string($q) . "%";
    $where[]  = "(b.book_title LIKE '$like' OR a.author_name LIKE '$like')";
}

if ($genre_id) {
    $where[] = "EXISTS (
        SELECT 1 FROM book_genres bg2
        WHERE bg2.book_id = b.book_id AND bg2.genre_id = $genre_id
    )";
}

$whereClause = implode(" AND ", $where);

// Replace the SELECT in get_books_student.php
$result = $conn->query("
    SELECT
        b.book_id,
        b.book_title,
        b.description,
        b.publish_date,
        b.price,
        b.stock,
        GROUP_CONCAT(DISTINCT a.author_name SEPARATOR ', ') AS authors,
        GROUP_CONCAT(DISTINCT g.genre       SEPARATOR ', ') AS genres
    FROM books b
    LEFT JOIN book_authors ba ON ba.book_id = b.book_id
    LEFT JOIN authors a       ON a.author_id = ba.author_id
    LEFT JOIN book_genres bg  ON bg.book_id = b.book_id
    LEFT JOIN genres g        ON g.genre_id = bg.genre_id
    WHERE $whereClause
    GROUP BY b.book_id
    ORDER BY b.book_title ASC
");

$books = [];
while ($row = $result->fetch_assoc()) $books[] = $row;

echo json_encode(["success" => true, "books" => $books]);
$conn->close();
?>