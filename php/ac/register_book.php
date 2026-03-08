<?php

header("Content-Type: application/json");

require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$title = $_POST["book_title"] ?? "";
$description = $_POST["description"] ?? "";
$publish_date = $_POST["publish_date"] ?? "";
$price = $_POST["price"] ?? 0;
$stock = $_POST["stock"] ?? 0;
$author_id = $_POST["author_id"] ?? 0;
$genre_ids = $_POST["genre_ids"] ?? []; // this will now be an array

if (!$title || !$author_id || empty($genre_ids)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$conn->begin_transaction();

try {
    // Insert book
    $stmt = $conn->prepare("INSERT INTO books (book_title, description, publish_date, price, stock) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdi", $title, $description, $publish_date, $price, $stock);
    $stmt->execute();
    $book_id = $conn->insert_id;
    $stmt->close();

    // Insert author
    $stmt = $conn->prepare("INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $book_id, $author_id);
    $stmt->execute();
    $stmt->close();

    // Insert multiple genres
    $stmt = $conn->prepare("INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)");
    foreach ($genre_ids as $gid) {
        $stmt->bind_param("ii", $book_id, $gid);
        $stmt->execute();
    }
    $stmt->close();

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Book registered successfully"]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error registering book: " . $e->getMessage()]);
}

$conn->close();
?>