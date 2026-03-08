<?php
header('Content-Type: application/json');
include '../core/database.php';

try {
    // Query to get book info with authors and genres
    $sql = "
        SELECT 
            b.book_id,
            b.book_title,
            b.description,
            b.publish_date,
            b.price,
            b.stock,
            a.author_name,
            g.genre
        FROM books b
        LEFT JOIN book_authors ba ON b.book_id = ba.book_id
        LEFT JOIN authors a ON ba.author_id = a.author_id
        LEFT JOIN book_genres bg ON b.book_id = bg.book_id
        LEFT JOIN genres g ON bg.genre_id = g.genre_id
        ORDER BY b.book_id ASC
    ";

    $result = $conn->query($sql);

    $books = [];

    while($row = $result->fetch_assoc()){
        $book_id = $row['book_id'];

        // If book not added yet
        if(!isset($books[$book_id])){
            $books[$book_id] = [
                "book_id" => $book_id,
                "book_title" => $row['book_title'],
                "description" => $row['description'],
                "publish_date" => $row['publish_date'],
                "price" => $row['price'],
                "stock" => $row['stock'],
                "authors" => [],
                "genres" => []
            ];
        }

        // Add author if not already in array
        if($row['author_name'] && !in_array($row['author_name'], $books[$book_id]['authors'])){
            $books[$book_id]['authors'][] = $row['author_name'];
        }

        // Add genre if not already in array
        if($row['genre'] && !in_array($row['genre'], $books[$book_id]['genres'])){
            $books[$book_id]['genres'][] = $row['genre'];
        }
    }

    // Re-index array numerically
    $books = array_values($books);

    echo json_encode([
        "success" => true,
        "books" => $books
    ]);

} catch(Exception $e){
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();
?>