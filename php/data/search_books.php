<?php
header("Content-Type: application/json");
require_once "../core/database.php";

$q = trim($_GET["q"] ?? "");
if (empty($q)) { echo json_encode([]); exit; }

$like = "%" . $conn->real_escape_string($q) . "%";

$result = $conn->query("
    SELECT book_id, book_title, stock
    FROM books
    WHERE book_title LIKE '$like'
    AND stock > 0
");

$books = [];
while ($row = $result->fetch_assoc()) $books[] = $row;

echo json_encode($books);
$conn->close();
?>